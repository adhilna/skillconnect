import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        logger.info(f"WebSocket connect called for user: {user} (Anonymous: {user.is_anonymous})")
        if user.is_anonymous:
            logger.warning("Anonymous user tried to connect. Closing WebSocket.")
            await self.close()
        else:
            self.group_name = f"user_{user.id}"
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            logger.info(f"User {user} joined group {self.group_name}")
            await self.accept()

    async def disconnect(self, close_code):
        user = self.scope['user']
        logger.info(f"WebSocket disconnect called for user: {user} with close code {close_code}")
        if not user.is_anonymous:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            logger.info(f"User {user} left group {self.group_name}")

    async def send_notification(self, event):
        notification_data = event.get('message')
        logger.debug(f"Sending notification to WebSocket: {notification_data}")
        await self.send(text_data=json.dumps(notification_data))
