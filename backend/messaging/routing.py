from django.urls import path
from .consumers import ChatConsumer
from .contract_consumer import ContractConsumer

websocket_urlpatterns = [
    path('ws/messaging/chat/<int:conversation_id>/', ChatConsumer.as_asgi()),
    path('ws/messaging/contracts/<str:order_type>/<int:order_id>/', ContractConsumer.as_asgi()),
]
