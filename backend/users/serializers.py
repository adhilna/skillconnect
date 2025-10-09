from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .tasks import send_otp_email_task
from .utils import generate_otp
from django.core.cache import cache

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label=_('password'),
    )
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[('CLIENT', 'Client'), ('FREELANCER', 'Freelancer')])


    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'role']
        read_only_fields = ['id']

    def validate_password(self, value):
        """
        Validate password strength (e.g., minimum length).
        """
        if len(value) < 8:
            raise serializers.ValidationError(_('Password must be at least 8 characters long.'))
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("This email is already registered."))
        return value


    def save(self):
        """
        Save registration data temporarily in cache with OTP.
        """
        data = self.validated_data
        otp = generate_otp()
        # Save in cache: key = email, value = dict(password, role, otp)
        cache.set(f"register:{data['email']}", {
            "password": data['password'],
            "role": data['role'],
            "otp": otp
        }, timeout=5*60)  # OTP valid 5 mins

        # Send OTP asynchronously
        send_otp_email_task.delay(data['email'], otp)
        return {"email": data['email'], "otp_sent": True}

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid email or password")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password")
        if not user.is_active:
            raise AuthenticationFailed("Account disabled")

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'first_login': user.first_login
            }
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_login']
        read_only_fields = ['id', 'email', 'role']

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        cached = cache.get(f"register:{email}")
        if not cached:
            raise serializers.ValidationError("Registration session expired or invalid.")

        if cached["otp"] != otp:
            raise serializers.ValidationError("Invalid OTP.")

        attrs["cached_data"] = cached
        return attrs

    def save(self):
        """
        Create actual User in DB after OTP verification.
        """
        cached_data = self.validated_data["cached_data"]
        from .models import User
        user = User.objects.create_user(
            email=self.validated_data["email"],
            password=cached_data["password"],
            role=cached_data["role"],
            is_active=True,
            is_verified=True,
            first_login=True
        )
        # Clear cache
        cache.delete(f"register:{self.validated_data['email']}")
        return user

class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()
        send_otp_email_task.delay(user.email, otp)  # Asynchronous email sending

class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is registered with this email.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()
        send_otp_email_task.delay(user.email, otp)
        return {"detail": "OTP sent to email"}

class ForgotPasswordVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")

        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP.")

        if timezone.now() - user.otp_created_at > timezone.timedelta(minutes=1):
            raise serializers.ValidationError("OTP has expired.")

        return attrs

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")

        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP.")

        if timezone.now() - user.otp_created_at > timezone.timedelta(minutes=1):
            raise serializers.ValidationError("OTP has expired.")

        return attrs

    def save(self):
        email = self.validated_data['email']
        new_password = self.validated_data['new_password']
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.otp = None
        user.otp_created_at = None
        user.save()
        return {"detail": "Password reset successfully"}
