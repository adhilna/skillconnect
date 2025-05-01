from rest_framework import generics
from .models import Service
from .serializers import ServiceSerialzer

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerialzer

    def get_queryset(self):
        location = self.request.query_params.get('location')
        if location:
            return self.queryset.filter(worker__workerprofile__location=location)
        return self.queryset
    