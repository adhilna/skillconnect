from rest_framework import serializers
from .models import Service, ServiceCategory

class ServiceCategorySerialzer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name']

class ServiceSerialzer(serializers.ModelSerializer):
    category = ServiceCategorySerialzer(read_only=True)
    worker_location = serializers.CharField(source='worker.workerprofile.location', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'price', 'worker', 'category', 'worker_location']
