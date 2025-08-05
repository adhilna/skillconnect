from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/messaging/chat/<int:conversation_id>/', ChatConsumer.as_asgi()),
]
