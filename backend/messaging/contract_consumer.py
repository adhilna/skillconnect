import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ContractConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_type = self.scope['url_route']['kwargs']['order_type']  # 'service' or 'proposal'
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.room_group_name = f"contracts_{self.order_type}_{self.order_id}"

        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
            return

        # Optional: permission checks to verify this user can join this contract group

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def contract_message(self, event):
        await self.send(text_data=json.dumps(event['contract']))
