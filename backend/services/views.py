from rest_framework import generics, serializers
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsCustomer, IsWorker

class ServiceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsCustomer]
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        location = self.request.query_params.get('location')
        if location:
            return self.queryset.filter(worker__workerprofile__location=location)
        return queryset
    

class ServiceCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsWorker]
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'workerprofile'):
            raise serializers.ValidationError("User must have a worker profile to create a service.")
        serializer.save(worker=self.request.user)
        