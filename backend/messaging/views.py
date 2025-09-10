from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.db.models import Q
import logging
from .models import Conversation, Message, ConversationReadStatus, Contract, PaymentRequest
from gigs.models import ServiceOrder, ProposalOrder
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    MessageCreateSerializer,
    ContractSerializer,
    PaymentRequestSerializer,
)
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now
from rest_framework.decorators import action
from .permissions import IsPaymentParticipantPermission


# --- Custom Permission: Only participants can access

logger = logging.getLogger(__name__)

class IsParticipantPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        logger.debug(f"Has_permission called with user: {request.user}, method: {request.method}, kwargs: {view.kwargs}")

        if request.method in permissions.SAFE_METHODS:
            logger.debug("Safe method allowed")
            return True

        conversation_id = view.kwargs.get('conversation_id')
        logger.debug(f"conversation_id from URL kwargs: {conversation_id}")

        if conversation_id:
            result = self._is_user_participant(request.user, conversation_id)
            logger.debug(f"User participant check result: {result}")
            return result

        if hasattr(view, 'basename') and view.basename == 'conversation' and request.method == 'POST':
            logger.debug("Allowing conversation creation POST")
            return True

        logger.debug("Permission denied in has_permission")
        return False

    def has_object_permission(self, request, view, obj):
        result = self._is_user_participant(request.user, obj.id)
        logger.debug(f"Has_object_permission check: {result}")
        return result

    def _is_user_participant(self, user, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return False

        client_profile = getattr(user, 'client_profile', None)
        freelancer_profile = getattr(user, 'freelancer_profile', None)

        client_ok = client_profile is not None and conversation.client == client_profile
        freelancer_ok = freelancer_profile is not None and conversation.freelancer == freelancer_profile

        print(f"Permission check for user {user.id}: client_ok={client_ok}, freelancer_ok={freelancer_ok}")

        return client_ok or freelancer_ok

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

        from gigs.models import ServiceOrder, ProposalOrder
        model = ServiceOrder if order_type == "serviceorder" else ProposalOrder

        try:
            order = model.objects.get(id=order_id)
        except model.DoesNotExist:
            raise serializers.ValidationError({"order_id": "Order not found."})

        client = order.client
        if order_type == "serviceorder":
            freelancer = order.service.freelancer
        else:  # proposalorder
            freelancer = order.freelancer

        content_type = ContentType.objects.get_for_model(model)
        convo, created = Conversation.objects.get_or_create(
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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        conversation_id = self.kwargs.get('conversation_id')
        conversation = get_object_or_404(Conversation, id=conversation_id)
        context['conversation'] = conversation
        return context

    def perform_create(self, serializer):
        conversation = self.get_serializer_context()['conversation']
        msg = serializer.save(sender=self.request.user, conversation=conversation)

        channel_layer = get_channel_layer()
        group_name = f"chat_{conversation.id}"
        serialized = MessageSerializer(msg, context={'request': self.request}).data

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

    def list(self, request, *args, **kwargs):
        conversation_id = kwargs.get("conversation_id")
        conversation = get_object_or_404(Conversation, id=conversation_id)
        self.check_object_permissions(request, conversation)

        # Update last_read_at timestamp for the user on this conversation
        ConversationReadStatus.objects.update_or_create(
            user=request.user,
            conversation=conversation,
            defaults={'last_read_at': now()}
        )

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='react')
    def react(self, request, conversation_id=None, pk=None):
        """
        Add/update an emoji reaction to a message.
        """
        message = self.get_object()
        emoji = request.data.get('emoji')

        if not emoji:
            return Response({'error': 'emoji field is required'}, status=400)

        # Update reactions dict
        reactions = message.reactions or {}
        reactions[emoji] = reactions.get(emoji, 0) + 1
        message.reactions = reactions
        message.save(update_fields=['reactions'])

        # Serialize updated message with request context to get absolute URLs
        from .serializers import MessageSerializer
        serialized = MessageSerializer(message, context={'request': request}).data

        # Broadcast updated message to WebSocket group
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"chat_{message.conversation.id}",
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

        return Response(serialized)

def broadcast_contract_update(contract):
    """
    Sends the latest contract data to the WebSocket group
    for the given order_type and order_id.
    """
    if contract.service_order_id:
        order_type = 'service'
        order_id = contract.service_order_id
    elif contract.proposal_order_id:
        order_type = 'proposal'
        order_id = contract.proposal_order_id
    else:
        return  # Cannot broadcast without order link

    group_name = f"contracts_{order_type}_{order_id}"
    channel_layer = get_channel_layer()
    serialized = ContractSerializer(contract).data

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "contract_message",  # matches ContractConsumer.contract_message()
            "contract": serialized,
        }
    )

class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        order_type = self.request.query_params.get('order_type')
        order_id = self.request.query_params.get('order_id')

        # Base queryset is empty unless filtering by order_type and order_id is provided
        if order_type and order_id:
            if order_type == 'service':
                # Filter contracts related to service order for which user is client or freelancer
                return Contract.objects.filter(
                    service_order_id=order_id
                ).filter(
                    Q(service_order__client__user=user) | Q(service_order__freelancer__user=user)
                )
            elif order_type == 'proposal':
                # Filter contracts related to proposal order for which user is client or freelancer
                return Contract.objects.filter(
                    proposal_order_id=order_id
                ).filter(
                    Q(proposal_order__client__user=user) | Q(proposal_order__freelancer__user=user)
                )
        # If no order_type/order_id, default to contracts involving user in any way
        return Contract.objects.filter(
            Q(service_order__client__user=user) | Q(service_order__freelancer__user=user) |
            Q(proposal_order__client__user=user) | Q(proposal_order__freelancer__user=user)
        )

    def perform_create(self, serializer):
        order_type = self.request.data.get('order_type')
        order_id = self.request.data.get('order_id')

        if order_type == 'service':
            service_order = get_object_or_404(ServiceOrder, id=order_id)
            # Optional: permission check to ensure user is freelancer of service_order
            contract = serializer.save(service_order=service_order)
        elif order_type == 'proposal':
            proposal_order = get_object_or_404(ProposalOrder, id=order_id)
            # Optional: permission check to ensure user is freelancer of proposal_order
            contract = serializer.save(proposal_order=proposal_order)
        else:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'order_type': "Must be 'service' or 'proposal'."})
        
        broadcast_contract_update(contract)

    def perform_update(self, serializer):
        contract = serializer.save()  # save changes
        # 🔴 Send to WebSocket group after updating
        broadcast_contract_update(contract)

    # Optional: Custom actions (e.g. accept, reject contract)
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        contract = self.get_object()
        # Optional: permission checks (who can accept)
        contract.status = 'accepted'
        contract.save()
        broadcast_contract_update(contract) 
        return Response({'status': 'contract accepted'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        contract = self.get_object()
        # Optional: permission checks
        contract.status = 'rejected'
        contract.save()
        broadcast_contract_update(contract)
        return Response({'status': 'contract rejected'}, status=status.HTTP_200_OK)

class PaymentRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsPaymentParticipantPermission]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'freelancer_profile'):
            # Freelancer sees payment requests they created
            return PaymentRequest.objects.filter(requested_by=user)
        elif hasattr(user, 'client_profile'):
            # Client sees payment requests for which they are payee
            return PaymentRequest.objects.filter(payee=user)
        return PaymentRequest.objects.none()

    def perform_create(self, serializer):
        # Set requesting user as the freelancer creating the PaymentRequest
        serializer.save(requested_by=self.request.user)

    def perform_update(self, serializer):
        # Allow clients to update payment request status or other fields as needed
        serializer.save()
