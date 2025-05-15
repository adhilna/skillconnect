from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label=_('password'),
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'password', 'role']
        read_only_fields = ['id']

    def validate_password(self, value):
        """
        Validate password strength (e.g., minimum length).
        """
        if len(value) < 8:
            raise serializers.ValidationError(_('Password must be at least 8 characters long.'))
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone'),
            role=validated_data.get('role', 'CLIENT')
        )
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed("Invalid email or password")
        if not user.is_active:
            raise AuthenticationFailed( "Account disabled")
        
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'first_login':user.first_login
            }
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'role', 'first_login']
        read_only_fields = ['email', 'role']

# class FreelancerProfileSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)
#     location = LocationSerializer(read_only=True)
#     rate = RateSerializer(many=True, read_only=True)

#     class Meta:
#         model = FreelancerProfile
#         fields = ['id', 'user', 'bio', 'profile_photo', 'location', 'rate', 'is_complete', 'created_at', 'updated_at']
#         read_only_fields = ['id', 'user', 'rates', 'is_complete', 'created_at', 'updated_at']

# class  CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ['id', 'name']
#         read_only_fields = ['id']

# class ResumeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Resume
#         fields = ['id', 'file', 'uploaded_at']
#         read_only_fields = ['id', 'uploaded_at']

#     def validate(self, data):
#         # Ensure user is a freelancer
#         user = self.context['request'].user
#         if user.role != 'FREELANCER':
#             raise serializers.ValidationError(_('Only freelancers can upload resumes'))
#         return data

# class SkillSerializer(serializers.ModelSerializer):
#     category = CategorySerializer(read_only=True)
#     category_id = serializers.PrimaryKeyRelatedField(
#         queryset=Category.objects.all(),
#         source='category',
#         write_only=True,
#         required=False
#     )

#     class Meta:
#         model = Skill
#         fields = ['id', 'name', 'category', 'category_id']
#         read_only_fields = ['id']

#     def validate(self, data):
#         # Ensure user is a freelancer
#         user = self.context['request'].user
#         if user.role != 'FREELANCER':
#             raise serializers.ValidationError(_('Only freelancers can validate skills'))
#         return data

# class ExperiexnceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Experience
#         fields = ['id', 'job_title', 'company', 'start_date', 'end_date', 'description']
#         read_only_fields = ['id']

#     def validate(self, data):
#         # Ensure user is a freelancer and start_date is before end_date
#         user = self.context['request'].user
#         if user.role != 'FREELANCER':
#             raise serializers.ValidationError(_('Only freelancers can add experiences.'))
#         start_date = data.get('start_date')
#         end_date = data.get('end_date')
#         if end_date and start_date and end_date < start_date:
#             raise serializers.ValidationError(_('End date must be after start date'))
#         return data

# class EducationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Education
#         fields = ['id', 'institution', 'degree', 'year']
#         read_only_fields = ['id']

#     def validate(self, data):
#         user = self.context['request'].user
#         if user.role != 'FREELANCER':
#             raise serializers.ValidationError(_('Only freelancers can add educations'))
#         year = data.get('year')
#         if year and year < 1950:
#             raise serializers.ValidationError('Year must be after 1950')
#         return data
