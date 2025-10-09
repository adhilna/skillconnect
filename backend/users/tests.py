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

class VerifyOTPTests(APITestCase):
    def setUp(self):
        self.verify_otp_url = '/api/v1/auth/users/verify-otp/'
        self.email = 'newuser@example.com'
        self.password = 'testpassword123'
        self.role = 'CLIENT'
        self.otp = '123456'
        # Simulate registration cache (normally set by RegisterSerializer.save())
        cache.set(f"register:{self.email}", {
            "password": self.password,
            "role": self.role,
            "otp": self.otp,
        }, timeout=5*60)

    def test_verify_otp_success(self):
        payload = {
            "email": self.email,
            "otp": self.otp
        }
        response = self.client.post(self.verify_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The user should now exist in DB and be verified
        user = User.objects.get(email=self.email)
        self.assertTrue(user.is_verified)
        self.assertTrue(user.first_login)
        self.assertEqual(user.role, self.role)
        self.assertEqual(user.email, self.email)
        # OTP and OTP_created_at should be null/empty
        self.assertIsNone(user.otp)
        self.assertIsNone(user.otp_created_at)

    def test_verify_otp_invalid(self):
        payload = {
            "email": self.email,
            "otp": "000000",
        }
        response = self.client.post(self.verify_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid OTP", str(response.data))

    def test_verify_otp_no_cache(self):
        # Remove cache/registration session
        cache.delete(f"register:{self.email}")
        payload = {
            "email": self.email,
            "otp": self.otp,
        }
        response = self.client.post(self.verify_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Registration session expired", str(response.data))

    def test_verify_otp_existing_email(self):
        # Create user with same email before verifying OTP
        User.objects.create_user(email=self.email, password="test", role="CLIENT", is_verified=True)
        payload = {
            "email": self.email,
            "otp": self.otp,
        }
        response = self.client.post(self.verify_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Response could include "already registered" depending on serializer logic

class ResendOTPTests(APITestCase):
    def setUp(self):
        self.resend_otp_url = '/api/v1/auth/users/resend-otp/'
        self.email_unverified = 'unverified@example.com'
        self.email_verified = 'verified@example.com'
        self.email_nonexistent = 'noone@example.com'

        # Create users for tests
        self.unverified_user = User.objects.create_user(
            email=self.email_unverified,
            password='testpass123',
            role='CLIENT',
            is_verified=False
        )
        self.verified_user = User.objects.create_user(
            email=self.email_verified,
            password='testpass123',
            role='CLIENT',
            is_verified=True
        )

    def test_resend_otp_success_for_unverified_user(self):
        payload = {"email": self.email_unverified}
        response = self.client.post(self.resend_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("OTP", response.data["message"].upper())

    def test_resend_otp_error_for_verified_user(self):
        payload = {"email": self.email_verified}
        response = self.client.post(self.resend_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Email already verified", str(response.data))

    def test_resend_otp_error_for_nonexistent_user(self):
        payload = {"email": self.email_nonexistent}
        response = self.client.post(self.resend_otp_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("does not exist", str(response.data))