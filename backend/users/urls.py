from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, UserUpdateView, VerifyOTPView, ResendOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
]
