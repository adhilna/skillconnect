from rest_framework import viewsets, permissions, serializers, status
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
from .pagination import PaymentHistoryPagination
from .razorpay_client import client
from django.conf import settings

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

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantPermission]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, "client_profile"):
            return Conversation.objects.filter(
                is_active=True,
                client=user.client_profile
            ).distinct()
        elif hasattr(user, "freelancer_profile"):
            return Conversation.objects.filter(
                is_active=True,
                freelancer=user.freelancer_profile
            ).distinct()


        return Conversation.objects.none()


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Perform creation (calls perform_create under the hood)
        self.perform_create(serializer)
        # 'serializer.instance' is now the created message
        obj = serializer.instance
        full_data = MessageSerializer(obj, context=self.get_serializer_context()).data
        return Response(full_data, status=status.HTTP_201_CREATED)

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

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Returns active contracts for the logged-in user with:
        - freelancer name
        - service title
        - category
        - progress
        - amount
        """
        user = request.user

        active_steps = [
            'planning', 'advance', 'draft', 'submitted',
            'in-progress', 'milestone-1', 'revision', 'final-review',
            'completed', 'paid'
        ]

        contracts = Contract.objects.filter(
            (
                Q(service_order__client__user=user) |
                Q(service_order__freelancer__user=user) |
                Q(proposal_order__client__user=user) |
                Q(proposal_order__freelancer__user=user)
            ),
            workflow_status__in=active_steps,
            status='accepted'
        ).select_related(
            'service_order',
            'service_order__service',
            'service_order__freelancer',
            'service_order__freelancer__user',
            'proposal_order',
            'proposal_order__freelancer',
            'proposal_order__freelancer__user',
        )

        data = []

        for contract in contracts:
            order = contract.service_order or contract.proposal_order

            freelancer_name = "N/A"
            client_name = "N/A"
            title = ""
            category_name = None

            if order:
                freelancer_profile = getattr(order, 'freelancer', None)
                if freelancer_profile:
                    freelancer_name = getattr(freelancer_profile, 'full_name', None) or getattr(freelancer_profile, 'name', None) or str(freelancer_profile)

                client_profile = getattr(order, 'client', None)
                if client_profile:
                    client_name = getattr(client_profile, 'full_name', None) or getattr(client_profile, 'name', None) or str(client_profile)

                if hasattr(order, 'service') and order.service:
                    # ServiceOrder case
                    title = order.service.title
                    category_name = order.service.category.name if order.service.category else None
                elif hasattr(order, 'proposal'):
                    # ProposalOrder case (adjust field names as per your ProposalOrder model)
                    title = order.proposal.title
                    category_name = order.proposal.category.name if order.proposal.category else None

            workflow_index = contract.WORKFLOW_STEPS.index(contract.workflow_status)
            progress = ((workflow_index + 1) / len(contract.WORKFLOW_STEPS)) * 100

            data.append({
                'id': contract.id,
                'title': title,
                'freelancer': freelancer_name,
                'client': client_name,
                'category': category_name,
                'status': contract.workflow_status,
                'deadline': contract.deadline,
                'progress': progress,
                'amount': contract.amount,
            })

        return Response(data)

    @action(detail=False, methods=['get'])
    def unique_freelancers(self, request):
        """
        Returns a list of unique freelancers (id + name) who accepted contracts for the logged-in client.
        Works for both service and proposal orders.
        """
        user = request.user

        active_statuses = [
            'planning', 'advance', 'draft', 'submitted',
            'in-progress', 'milestone-1', 'revision', 'final-review'
        ]

        # Accepted contracts where user is the client
        accepted_contracts = Contract.objects.filter(
            status='accepted',
            workflow_status__in=active_statuses
        ).filter(
            Q(service_order__client__user=user) | Q(proposal_order__client__user=user)
        )

        freelancers = []
        seen_ids = set()

        for contract in accepted_contracts:
            freelancer = None
            if contract.service_order and contract.service_order.freelancer:
                freelancer = contract.service_order.freelancer
            elif contract.proposal_order and contract.proposal_order.freelancer:
                freelancer = contract.proposal_order.freelancer

            if freelancer and freelancer.id not in seen_ids:
                freelancers.append({
                    'id': freelancer.id,
                    'name': f"{freelancer.first_name} {freelancer.last_name}".strip()
                })
                seen_ids.add(freelancer.id)

        return Response({
            'count': len(freelancers),
            'freelancers': freelancers
        })

class PaymentRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsPaymentParticipantPermission]
    pagination_class = PaymentHistoryPagination

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'client_profile'):
            return PaymentRequest.objects.filter(payee=user)
        elif hasattr(user, 'freelancer_profile'):
            return PaymentRequest.objects.filter(requested_by=user)
        return PaymentRequest.objects.none()

    def perform_create(self, serializer):
        contract = serializer.validated_data.get('contract')
        payee_user = None

        if contract is not None:
            # Determine payee from contract's service_order or proposal_order
            if contract.service_order is not None:
                payee_user = contract.service_order.client.user
            elif contract.proposal_order is not None:
                payee_user = contract.proposal_order.client.user

        serializer.save(requested_by=self.request.user, payee=payee_user)

    def perform_update(self, serializer):
        # Only allow status update if user is the payee
        payment_request = self.get_object()
        user = self.request.user

        new_status = serializer.validated_data.get('status')

        if new_status and user == payment_request.payee:
            payment_request.status = new_status
            payment_request.save()
        else:
            # For other updates, allow normally
            serializer.save()

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = PaymentRequest.objects.all()
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Only allow requests relevant to the user
        return PaymentRequest.objects.filter(
            requested_by=user
        ) | PaymentRequest.objects.filter(
            payee=user
        )

    @action(detail=True, methods=['post'], url_path='create-razorpay-order')
    def create_razorpay_order(self, request, pk=None):
        payment_req = self.get_object()
        if payment_req.status != 'pending':
            return Response({"error": "Order already processed"}, status=status.HTTP_400_BAD_REQUEST)
        amount = int(payment_req.amount * 100)  # paise
        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1",
            "notes": {
                "payment_request_id": payment_req.id
            }
        })
        payment_req.transaction_id = order['id']
        payment_req.save()
        return Response({
            "order_id": order['id'],
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "amount": amount,
            "currency": "INR",
            "description": payment_req.description
        })

    @action(detail=True, methods=['post'], url_path='verify-razorpay-payment')
    def verify_razorpay_payment(self, request, pk=None):
        payment_req = self.get_object()
        data = request.data
        params_dict = {
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        }
        try:
            client.utility.verify_payment_signature(params_dict)
            payment_req.status = 'completed'
            payment_req.payment_method = 'Razorpay'
            payment_req.transaction_id = data.get("razorpay_payment_id")
            payment_req.save()
            return Response({"success": True})
        except SignatureVerificationError:
            payment_req.status = 'failed'
            payment_req.save()
            return Response({"success": False, "error": "Invalid signature!"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            payment_req.status = 'rejected'
            payment_req.save()
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentRequestFullViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsPaymentParticipantPermission]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'client_profile'):
            return PaymentRequest.objects.filter(payee=user)
        elif hasattr(user, 'freelancer_profile'):
            return PaymentRequest.objects.filter(requested_by=user)
        return PaymentRequest.objects.none()
