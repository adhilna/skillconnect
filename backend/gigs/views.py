from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Service, Proposal
from .serializers import ServiceSerializer, ProposalSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Service.objects.filter(freelancer=self.request.user.freelancer_profile)

    def perform_create(self, serializer):
        serializer.save()

class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        # For current user's client profile; adjust filter as needed
        return Proposal.objects.filter(client=self.request.user.client_profile)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_profile)