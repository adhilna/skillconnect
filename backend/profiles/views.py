from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import FreelancerProfile, ClientProfile
from .serializers import FreelancerProfileSerializer, ClientProfileSerializer

class FreelancerProfileViewset(viewsets.ModelViewSet):
    serializer_class = FreelancerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FreelancerProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return FreelancerProfile.objects.get(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ClientProfileViewset(viewsets.ModelViewSet):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClientProfile.objects.filter(user = self.request.user)

    def get_object(self):
        return ClientProfile.objects.get(user = self.request.user)
