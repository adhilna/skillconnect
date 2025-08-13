import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        user = self.scope['user']

        if user.is_anonymous:
            # Reject anonymous connections
            await self.close()
            return

        # Check if user is participant in the conversation
        is_participant = await self.is_conversation_participant(user, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        # Accept connection and add to group for broadcasting
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the chat group on disconnect
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Parse incoming data
        data = json.loads(text_data)
        message = data.get('message')
        attachments = data.get('attachments', [])  # Optional: handle if you implement attachments later

        sender = self.scope['user']

        if not message:
            # Invalid message content, ignore or send error if preferred
            return

        # Create and save the message instance in DB asynchronously
        msg = await self.create_message(sender, self.conversation_id, message)

        # Serialize message to send to the clients
        serialized = await self.serialize_message(msg)

        # Broadcast serialized message to group participants
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

    async def chat_message(self, event):
        # Send message event from the group to WebSocket client
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def is_conversation_participant(self, user, conversation_id):
        from django.contrib.auth.models import AnonymousUser
        if isinstance(user, AnonymousUser):
            return False

        try:
            conversation = Conversation.objects.get(id=conversation_id)
            client_ok = hasattr(user, 'client_profile') and conversation.client == user.client_profile
            freelancer_ok = hasattr(user, 'freelancer_profile') and conversation.freelancer == user.freelancer_profile
            return client_ok or freelancer_ok
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def create_message(self, sender, conversation_id, content):
        conversation = Conversation.objects.get(id=conversation_id)
        return Message.objects.create(
            sender=sender,
            conversation=conversation,
            content=content
        )

    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message).data
