from django.test import TestCase
from django.core.cache import cache
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class RegisterUserTests(APITestCase):
    def setUp(self):
        self.register_url = '/api/v1/auth/users/register/'
        self.verify_otp_url = '/api/v1/auth/users/verify-otp/'
        self.email = 'client@example.com'
        self.payload = {
            "email": self.email,
            "password": "strongpass123",
            "role": "CLIENT"
        }

    def test_registration_creates_cache_and_sends_otp(self):
        response = self.client.post(self.register_url, self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cached = cache.get(f"register:{self.email}")
        self.assertIsNotNone(cached)
        self.assertEqual(cached["role"], "CLIENT")

    def test_registration_weak_password_fails(self):
        payload = self.payload.copy()
        payload["password"] = "weak"
        response = self.client.post(self.register_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Password must be at least 8 characters long.', str(response.data))

    def test_duplicate_email_fails(self):
        User.objects.create_user(email=self.email, password="strongpass123", role="CLIENT")
        response = self.client.post(self.register_url, self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already registered', str(response.data))

    def test_verify_otp_success(self):
        # First register (to create cache)
        self.client.post(self.register_url, self.payload)
        cached = cache.get(f"register:{self.email}")
        otp = cached["otp"]

        data = {"email": self.email, "otp": otp}
        response = self.client.post(self.verify_otp_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # User should exist now
        user = User.objects.filter(email=self.email)
        self.assertTrue(user.exists())

    def test_verify_otp_failure(self):
        self.client.post(self.register_url, self.payload)
        # Use wrong OTP
        data = {"email": self.email, "otp": "000000"}
        response = self.client.post(self.verify_otp_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LoginUserTests(APITestCase):
    def setUp(self):
        self.login_url = '/api/v1/auth/users/login/'
        # Create a verified, active user for login testing
        self.user = User.objects.create_user(
            email="testlogin@example.com",
            password="strongpass123",
            role="CLIENT",
            is_verified=True,
            is_active=True
        )

    def test_login_success(self):
        payload = {
            "email": "testlogin@example.com",
            "password": "strongpass123"
        }
        response = self.client.post(self.login_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "testlogin@example.com")

    def test_login_invalid_password(self):
        payload = {
            "email": "testlogin@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid email or password", str(response.data))

    def test_login_disabled_user(self):
        disabled_user = User.objects.create_user(
            email="disabled@example.com",
            password="strongpass123",
            role="CLIENT",
            is_verified=True,
            is_active=False
        )
        payload = {
            "email": "disabled@example.com",
            "password": "strongpass123"
        }
        response = self.client.post(self.login_url, payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Account disabled", str(response.data))
