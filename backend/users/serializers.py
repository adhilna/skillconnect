from rest_framework import serializers
from .models import User, Profile, WorkerProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    worker_profile = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'full_name', 'phone', 'location', 'worker_profile']

    def get_worker_profile(self, obj):
        try:
            worker_profile = obj.user.workerprofile
            return {
                'skills': worker_profile.skills,
                'hourly_rate': worker_profile.hourly_rate,
                'availability': worker_profile.availability,
                'certifications': worker_profile.certifications,
                'location': worker_profile.location
            }
        except WorkerProfile.DoesNotExist:
            return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=128, required=False)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    location = serializers.CharField(max_length=100, required=False, allow_blank=True)
    skills = serializers.CharField(required=False, allow_blank=True)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    availability = serializers.CharField(required=False, allow_blank=True)
    certifications = serializers.CharField(required=False, allow_blank=True)
    worker_location = serializers.CharField(max_length=100, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'full_name', 'phone', 'location', 'skills', 'hourly_rate', 'availability', 'certifications', 'worker_location']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate(self, data):
        if data['role'] == 'worker' and not data.get('skills'):
            raise serializers.ValidationError("Skills are required for workers")
        if data['role'] == 'worker' and not data.get('worker_location'):
            raise serializers.ValidationError("Location is required for workers")
        return data

    def create(self, validated_data):
        worker_fields = ['skills', 'hourly_rate', 'availability', 'certifications', 'worker_location']
        worker_data = {key: validated_data.pop(key, None) for key in worker_fields if key in validated_data}

        user = User(
            email=validated_data['email'],
            role=validated_data['role'],
            username=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        full_name = validated_data.get('full_name', validated_data['email'].split('@')[0])
        Profile.objects.create(
            user=user,
            full_name=full_name,
            phone=validated_data.get('phone', ''),
            location=validated_data.get('location', '')
        )

        if user.role == 'worker':
            WorkerProfile.objects.create(
                user=user,
                skills=worker_data.get('skills', ''),
                hourly_rate=worker_data.get('hourly_rate', 0.00),
                availability=worker_data.get('availability', ''),
                certifications=worker_data.get('certifications', ''),
                location=worker_data.get('worker_location', '')
            )

        return user