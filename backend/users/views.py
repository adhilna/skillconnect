from rest_framework import generics, status
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    OTPSerializer,
    ResendOTPSerializer,
    ForgotPasswordRequestSerializer,
    ForgotPasswordVerifySerializer,
    ResetPasswordSerializer
)
from .models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import serializers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from .tasks import send_otp_email_task
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model



class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save the user and get the instance
            send_otp_email_task.delay(user.email, user.otp)  # Use the correct Celery task
            return Response(
                {'message': 'User registered. OTP sent to your email.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            try:
                user = User.objects.get(email=email)
                if user.is_verified:
                    return Response({'error': 'Email already verified.'}, status=status.HTTP_400_BAD_REQUEST)
                if user.otp_is_valid() and user.otp == otp:
                    user.is_verified = True
                    user.first_login = True
                    user.otp = None
                    user.otp_created_at = None
                    user.save()
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'message': 'Email verified successfully.',
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'role': user.role,
                            'first_login': user.first_login
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/m', block=True))
    def post(self, request, *args, **kwargs):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if user.is_verified:
                    return Response({'error': 'Email already verified.'}, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
                return Response({'message': 'New OTP sent to your email.'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': f'Failed to resend OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ForgotPasswordRequestAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "OTP sent to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordVerifyAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordVerifySerializer(data=request.data)
        if serializer.is_valid():
            return Response({"detail": "OTP is valid"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        role = request.data.get('role')

        if not token:
            return Response({'detail': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                "177280873690-gfuk3olcl1ue5ue3c693jdd7850tk9uf.apps.googleusercontent.com"
            )
            email = idinfo.get('email')

            if not email:
                return Response({'detail': 'Email not found in token'}, status=status.HTTP_400_BAD_REQUEST)

            User = get_user_model()
            user, created = User.objects.get_or_create(email=email)

            if created:
                if not role:
                    return Response({'need_role': True}, status=200)
                if role not in ['CLIENT', 'FREELANCER']:
                    return Response({'detail': 'Invalid role.'}, status=400)
                user.role = role
                user.is_verified = True
                user.save()
            else:
                # Always update the role to the selected value
                if role in ['CLIENT', 'FREELANCER']:
                    user.role = role
                    user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role,
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({'detail': 'Invalid Google token'}, status=400)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)

