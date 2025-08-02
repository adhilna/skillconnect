from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    MessageCreateSerializer,
)

# --- Custom Permission: Only participants can access

class IsParticipantPermission(permissions.BasePermission):
    """
    Allow access only to the client or freelancer assigned to the conversation.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        client_profile = getattr(user, "clientprofile", None)
        freelancer_profile = getattr(user, "freelancerprofile", None)
        return (
            getattr(obj, "client", None) == client_profile or
            getattr(obj, "freelancer", None) == freelancer_profile
        )

# --- Conversation ViewSet

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantPermission]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        q = Q()
        if hasattr(user, "clientprofile"):
            q |= Q(client=user.clientprofile)
        if hasattr(user, "freelancerprofile"):
            q |= Q(freelancer=user.freelancerprofile)
        return Conversation.objects.filter(is_active=True).filter(q).distinct()

    def perform_create(self, serializer):
        order_type = self.request.data.get("order_type")
        order_id = self.request.data.get("order_id")

        if order_type not in ["serviceorder", "proposalorder"]:
            raise serializers.ValidationError({
                "order_type": "Must be 'serviceorder' or 'proposalorder'."
            })

        # Dynamically load correct model
        from gigs.models import ServiceOrder, ProposalOrder
        model = ServiceOrder if order_type == "serviceorder" else ProposalOrder

        try:
            order = model.objects.get(id=order_id)
        except model.DoesNotExist:
            raise serializers.ValidationError({"order_id": "Order not found."})

        # Determine participants
        client = order.client
        freelancer = order.service.freelancer if order_type == "serviceorder" else order.selected_freelancer

        # Prevent duplicate conversations
        content_type = ContentType.objects.get_for_model(model)
        convo, _ = Conversation.objects.get_or_create(
            content_type=content_type,
            object_id=order.id,
            client=client,
            freelancer=freelancer
        )

        serializer.instance = convo

# --- Message ViewSet

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsParticipantPermission]

    def get_serializer_class(self):
        if self.action == "create":
            return MessageCreateSerializer
        return MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs.get("conversation_id")
        conversation = get_object_or_404(Conversation, id=conversation_id)
        self.check_object_permissions(self.request, conversation)
        return Message.objects.filter(conversation=conversation).order_by("created_at")

    def perform_create(self, serializer):
        conversation_id = self.kwargs.get("conversation_id")
        conversation = get_object_or_404(Conversation, id=conversation_id)
        self.check_object_permissions(self.request, conversation)
        serializer.save(sender=self.request.user, conversation=conversation)
