from rest_framework import viewsets, permissions, status, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Service, Proposal, ServiceOrder, ProposalOrder
from .serializers import ServiceSerializer, ProposalSerializer, ServiceOrderSerializer, ExploreProposalSerializer, ProposalOrderSerializer
from .pagination import ExploreServicesPagination, StandardResultsSetPagination
import pprint
import json
from rest_framework.response import Response
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .utils import create_conversation_if_not_exists
from django.shortcuts import get_object_or_404

class IsClientPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Only users with client_profile can create
        if view.action == 'create':
            return request.user and request.user.is_authenticated and hasattr(request.user, 'client_profile')
        return True

class IsFreelancerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Only users with freelancer_profile can list or update orders
        if view.action in ['list', 'partial_update']:
            return request.user and request.user.is_authenticated and hasattr(request.user, 'freelancer_profile')
        return True

def parse_json_fields(data, fields):
    """
    Parses fields like 'skills_input' from FormData that might look like:
    ['[{"name":"React"}, {"name":"Python"}]'] → [{'name': ...}, ...]
    Handles double-nested lists as well: [[{...}]] → [{...}]
    """
    for field in fields:
        raw = data.get(field)
        try:
            # Handle case: ['[{"name":"..."}]']
            if isinstance(raw, list) and len(raw) == 1 and isinstance(raw[0], str):
                parsed = json.loads(raw[0])
            elif isinstance(raw, str):
                parsed = json.loads(raw)
            else:
                parsed = raw

            # Flatten [[{...}, {...}]] → [{...}, {...}]
            if isinstance(parsed, list) and len(parsed) == 1 and isinstance(parsed[0], list):
                parsed = parsed[0]

            data[field] = parsed
        except Exception as e:
            print(f"[ERROR] Failed to parse field '{field}': {e}")
            data[field] = []
    return data

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Service.objects.filter(freelancer=self.request.user.freelancer_profile)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user.freelancer_profile)

    def create(self, request, *args, **kwargs):
        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint({k: v for k, v in request.data.items()})
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data.copy()
        data = parse_json_fields(data, ['skills_input'])

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', True)

        data = request.data.copy()
        data = parse_json_fields(data, ['skills_input'])

        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Proposal.objects.filter(client=self.request.user.client_profile)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_profile)

class ServiceFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    delivery_time = django_filters.NumberFilter(field_name='delivery_time', lookup_expr='lte')
    skills = django_filters.CharFilter(field_name='skills__name', lookup_expr='icontains')

    class Meta:
        model = Service
        fields = ['category', 'min_price', 'max_price', 'delivery_time', 'skills']

class ExploreServicesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ExploreServicesPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ServiceFilter
    search_fields = [
        'title',
        'description',
        'category__name',
        'skills__name',
        'freelancer__user__first_name'
    ]
    ordering_fields = ['price', 'delivery_time', 'created_at']

    def get_queryset(self):
        return Service.objects.filter(is_active=True) \
                             .select_related('freelancer', 'category') \
                             .prefetch_related('skills')

class ExploreProposalFilter(django_filters.FilterSet):
    min_budget = django_filters.NumberFilter(field_name='budget_min', lookup_expr='gte')
    max_budget = django_filters.NumberFilter(field_name='budget_max', lookup_expr='lte')
    delivery_time = django_filters.NumberFilter(field_name='timeline_days', lookup_expr='lte')
    skills = django_filters.CharFilter(field_name='required_skills__name', lookup_expr='icontains')

    class Meta:
        model = Proposal
        fields = ['category', 'min_budget', 'max_budget', 'delivery_time', 'skills']

class ExploreProposalsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExploreProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ExploreServicesPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ExploreProposalFilter
    search_fields = ['title', 'description', 'category__name', 'skills__name', 'client__user__username']
    ordering_fields = ['budget', 'delivery_time', 'created_at']

    def get_queryset(self):
        return Proposal.objects.filter(is_active=True) \
            .select_related('client', 'category') \
            .prefetch_related('required_skills')

class ServiceOrderViewSet(viewsets.ModelViewSet):
    queryset = ServiceOrder.objects.all().order_by('-created_at')
    serializer_class = ServiceOrderSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsClientPermission()]
        elif self.action in ['list', 'partial_update']:
            return [permissions.IsAuthenticated(), IsFreelancerPermission()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            if hasattr(user, 'freelancer_profile'):
                return ServiceOrder.objects.filter(freelancer=user.freelancer_profile).order_by('-created_at')
            return ServiceOrder.objects.none()
        return super().get_queryset()

    def perform_create(self, serializer):
        order = serializer.save()  # Save the new order instance

        # Prepare to send a notification to the freelancer
        channel_layer = get_channel_layer()
        group_name = f"user_{order.freelancer.user.id}"  # The freelancer's user group

        notification_data = {
    'type': 'send_notification',
    'message': {
        'notification': {  # Wrap inside 'notification'
            'id': order.id,
            'title': order.service.title,
            'client': str(order.client),
            'status': order.status,
            'text': f"New order received from {order.client} for service '{order.service.title}'.",
            'created_at': str(order.created_at),
        }
    }
}

        # Send the notification asynchronously to the group channel
        async_to_sync(channel_layer.group_send)(group_name, notification_data)


    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()

        if order.freelancer.user != request.user:
            raise PermissionDenied("You can only update your own orders.")

        new_status = request.data.get('status', None)
        if not new_status:
            return Response({'error': 'Missing status field.'}, status=status.HTTP_400_BAD_REQUEST)

        allowed_statuses = ['accepted', 'rejected', 'cancelled']

        if new_status.lower() not in allowed_statuses:
            return Response(
                {'error': f"Status must be one of {allowed_statuses}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(order, data={'status': new_status.lower()}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class ProposalOrderViewSet(viewsets.ModelViewSet):
    queryset = ProposalOrder.objects.all().order_by('-created_at')
    serializer_class = ProposalOrderSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsFreelancerPermission()]
        elif self.action in ['list', 'partial_update']:
            return [permissions.IsAuthenticated(), IsClientPermission()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            if hasattr(user, 'client_profile'):
                # Show orders to client
                return ProposalOrder.objects.filter(client=user.client_profile).order_by('-created_at')
            return ProposalOrder.objects.none()
        return super().get_queryset()

    def perform_create(self, serializer):
        order = serializer.save()
        channel_layer = get_channel_layer()
        group_name = f"user_{order.client.user.id}"
        notification_data = {
            'type': 'send_notification',
            'message': {
                'notification': {
                    'id': order.id,
                    'title': order.proposal.title,
                    'freelancer': str(order.freelancer),
                    'status': order.status,
                    'text': f"New application received from {order.freelancer} for proposal '{order.proposal.title}'.",
                    'created_at': str(order.created_at),
                }
            }
        }
        async_to_sync(channel_layer.group_send)(group_name, notification_data)

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.client.user != request.user:
            raise PermissionDenied("You can only update your own proposal orders.")
        new_status = request.data.get('status', None)
        if not new_status:
            return Response({'error': 'Missing status field.'}, status=status.HTTP_400_BAD_REQUEST)

        allowed_statuses = ['accepted', 'rejected', 'cancelled']
        if new_status.lower() not in allowed_statuses:
            return Response(
                {'error': f"Status must be one of {allowed_statuses}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(order, data={'status': new_status.lower()}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

def accept_order(request, pk):
    order = get_object_or_404(ServiceOrder, pk=pk)
    order.status = "accepted"
    order.save()

    create_conversation_if_not_exists(order)

    return Response({'detail': 'Order accepted & conversation started'})
