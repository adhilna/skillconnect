# from rest_framework import serializers
# from .models import Service, ServiceCategory


# class ServiceCategorySerialzer(serializers.ModelSerializer):
#     class Meta:
#         model = ServiceCategory
#         fields = ['id', 'name']


# class ServiceSerializer(serializers.ModelSerializer):
#     category = ServiceCategorySerialzer(read_only=True)
#     category_id = serializers.PrimaryKeyRelatedField(
#         queryset=ServiceCategory.objects.all(), source='category', write_only=True
#     )
#     worker_location = serializers.CharField(source='worker.workerprofile.location', read_only=True)
#     worker = serializers.PrimaryKeyRelatedField(read_only=True)
#     price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)

#     class Meta:
#         model = Service
#         fields = ['id', 'title', 'description', 'price', 'worker', 'category', 'category_id', 'worker_location']
        
#     def validate(self, data):
#         if not data.get('title'):
#             raise serializers.ValidationError("Title is required")
#         if not data.get('category'):
#             raise serializers.ValidationError("Category is required")
#         return data 
    