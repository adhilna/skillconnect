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
            await self.close()
            return

        is_participant = await self.is_conversation_participant(user, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        This receive handler will only deal with simple text messages sent via WS.
        File/voice uploads are still handled by the REST API POST /messages/ endpoint.
        """
        data = json.loads(text_data)
        message_content = data.get('message')
        message_type = data.get('message_type', 'text')

        sender = self.scope['user']

        # Ignore empty messages (unless we add more handling later)
        if not message_content and message_type == 'text':
            return

        # Create and save the message in DB
        msg = await self.create_message(
            sender=sender,
            conversation_id=self.conversation_id,
            content=message_content,
            message_type=message_type
        )

        # Serialize the message exactly how REST API does (includes attachment if any)
        serialized = await self.serialize_message(msg)

        # Broadcast serialized message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

    async def chat_message(self, event):
        """
        Called when a message is sent to the group.
        """
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
    def create_message(self, sender, conversation_id, content, message_type='text'):
        """
        Basic message creation — handles only text when sent via WS.
        Voice/file messages will be created via REST API and broadcast separately.
        """
        conversation = Conversation.objects.get(id=conversation_id)
        return Message.objects.create(
            sender=sender,
            conversation=conversation,
            content=content,
            message_type=message_type
        )

    @database_sync_to_async
    def serialize_message(self, message):
        """
        Serialize a Message instance the same way the REST API does,
        so WebSocket broadcast matches fetch/GET structure exactly.
        """
        # Pass no request object here, so AttachmentSerializer will use SITE_URL fallback
        return MessageSerializer(message).data
