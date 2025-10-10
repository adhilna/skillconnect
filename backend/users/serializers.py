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
import re
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
import logging

def is_common_password(value):
    # Use your own list or import from Django's common password list
    common = {'password', 'admin', '12345678', 'qwerty', 'letmein'}
    return value.lower() in common

def advanced_email_check(email):
    # Optionally use a 3rd party library for full-blown RFC validation

    # Block disposable/temporary email domains
    disposable_domains = {'mailinator.com', '10minutemail.com', 'guerrillamail.com'}
    domain = email.split('@')[-1].lower()
    if domain in disposable_domains:
        return False
    return True

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
        if len(value) < 12:
            raise serializers.ValidationError(_('Password must be at least 12 characters long.'))

        if re.search(r'\s', value):
            raise serializers.ValidationError(_('Password must not contain spaces.'))

        if is_common_password(value):
            raise serializers.ValidationError(_('Password is too common.'))

        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(_('Password must contain at least one uppercase letter.'))

        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(_('Password must contain at least one lowercase letter.'))

        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(_('Password must contain at least one digit.'))

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(_('Password must contain at least one special character.'))

        if value == value[::-1]:
            raise serializers.ValidationError(_('Password cannot be a palindrome.'))

        # Optionally block repeated chars
        if re.search(r'(.)\1{3,}', value):
            raise serializers.ValidationError(_('Password contains repeated characters.'))

        return value

    def validate_email(self, value):
        try:
            django_validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError(_("Enter a valid email address."))

        value = value.strip().lower()

        email_regex = re.compile(
            r"(^[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(?:\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*"
            r'|^"([!#-[\]-~]|(\\[\t -~]))+"@)'
            r"([A-Z0-9a-z][A-Z0-9a-z-]{0,61}[A-Z0-9a-z]\.)+([A-Za-z]{2,})$"
        )
        if not email_regex.match(value):
            raise serializers.ValidationError(_("Email format is invalid."))

        if not advanced_email_check(value):
            raise serializers.ValidationError(_("Disposable email addresses are not allowed."))

        if User.objects.filter(email__iexact=value).exists():
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
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password')

        # Validate email format
        try:
            django_validate_email(email)
        except DjangoValidationError:
            raise AuthenticationFailed("Invalid email or password")

        # Lookup user
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            logging.warning(f"Failed login for email: {email}")
            raise AuthenticationFailed("Invalid email or password")

        # Password check (constant-time)
        if not user.check_password(password):
            logging.warning(f"Failed login for email: {email} (bad password)")
            raise AuthenticationFailed("Invalid email or password")

        # Block inactive accounts
        if not user.is_active:
            raise AuthenticationFailed("Account disabled")
        # Optionally block unverified accounts
        if hasattr(user, 'email_verified') and not user.email_verified:
            raise AuthenticationFailed("Email not verified. Please verify before login.")
        # Optionally block suspended/banned users
        if hasattr(user, 'is_banned') and user.is_banned:
            raise AuthenticationFailed("Account banned. Contact support.")

        refresh = RefreshToken.for_user(user)
        logging.info(f"Successful login for user ID: {user.id}, email: {email}")

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email.lower(),
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

        from .models import User
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("This email is already registered.")

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
