from rest_framework import generics
from .models import Service
from .serializers import ServiceSerialzer
from rest_framework.permissions import IsAuthenticated

class ServiceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Service.objects.all()
    serializer_class = ServiceSerialzer

    def get_queryset(self):
        queryset = super().get_queryset()
        location = self.request.query_params.get('location')
        if location:
            return self.queryset.filter(worker__workerprofile__location=location)
        return queryset
    