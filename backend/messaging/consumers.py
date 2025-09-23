import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return

        is_participant = await self.is_conversation_participant(self.user, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.channel_layer.group_send(
        self.room_group_name,
        {
            "type": "presence_event",
            "conversation_id": self.conversation_id,
            "user_id": self.user.id,
            "status": "online",
        }
    )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        await self.channel_layer.group_send(
        self.room_group_name,
        {
            "type": "presence_event",
            "conversation_id": self.conversation_id,
            "user_id": self.user.id,
            "status": "offline",
        }
    )

    async def presence_event(self, event):
        """
        Called when a user joins/leaves the conversation
        """
        await self.send(text_data=json.dumps({
            "type": "presence",
            "conversation_id": event["conversation_id"],
            "user_id": event["user_id"],
            "status": event["status"],
        }))

    async def receive(self, text_data):
        """
            Handle incoming WS events:
            - typing events (just broadcast, no DB write)
            - text messages (save to DB + broadcast)
        """
        data = json.loads(text_data)
        action_type = data.get('type')

        # 1️⃣ Typing event (no DB write, just notify others)
        if action_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "conversation_id": self.conversation_id,
                    "user_id": self.scope['user'].id,
                    "typing": data.get("typing", False),
                }
            )
            return

        # 2️⃣ Normal message handling (your existing logic)
        message_content = data.get('message')
        message_type = data.get('message_type', 'text')

        sender = self.scope['user']

        # Ignore empty messages (unless we add more handling later)
        if not message_content and message_type == 'text':
            return

        # Create and save the message in DB
        if message_type == "text":
            msg = await self.create_message(
                sender=sender,
                conversation_id=self.conversation_id,
                content=message_content,
                message_type=message_type
            )

            # Serialize message as REST API would
            serialized = await self.serialize_message(msg)
        else:
            # For payment or other types, do nothing here; created elsewhere
            return

        # Broadcast serialized message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

    async def typing_event(self, event):
        """
        Called when someone is typing in the conversation.
        Broadcasts typing state to all group members.
        """
        await self.send(text_data=json.dumps({
            "type": "typing",
            "conversation_id": event["conversation_id"],
            "user_id": event["user_id"],
            "typing": event["typing"],
        }))


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
