from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ConversationViewSet, MessageViewSet, ContractViewSet, PaymentRequestViewSet, PaymentViewSet,PaymentRequestFullViewSet
# Main router for conversations
router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'contracts', ContractViewSet, basename='contract')
router.register(r'payment-requests', PaymentRequestViewSet, basename='paymentrequest')
router.register(r'payment-requests-full', PaymentRequestFullViewSet, basename='payment-requests-full')
router.register(r'payments', PaymentViewSet, basename='payment')

# Custom nested view for messages under conversation
message_list = MessageViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

message_react = MessageViewSet.as_view({
    'post': 'react'
})

urlpatterns = [
    path('', include(router.urls)),
    path('conversations/<int:conversation_id>/messages/', message_list, name='conversation-messages'),
    path('conversations/<int:conversation_id>/messages/<int:pk>/react/', message_react, name='conversation-message-react'),
]
