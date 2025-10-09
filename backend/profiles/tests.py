from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from profiles.models import FreelancerProfile, ClientProfile

User = get_user_model()

class FreelancerProfileSetupTests(APITestCase):
    def setUp(self):
        self.create_url = '/api/v1/profiles/freelancer/profile-setup/'
        self.me_url = '/api/v1/profiles/freelancer/profile-setup/me/'
        self.user = User.objects.create_user(
            email='dev@test.com',
            password='strongPass123',
            role='FREELANCER',
            is_verified=True
        )
        self.client.force_authenticate(user=self.user)

    def test_create_freelancer_profile(self):
        payload = {
            "first_name": "Jane",
            "last_name": "Doe",
            "about": "I am a test freelancer.",
            "age": 27,
            "country": "India",
            "location": "Bangalore",
            "is_available": True,
            "skills_input": [{"name": "Python"}, {"name": "Django"}],
            "educations_input": [{
                "college": "IIT Bombay",
                "degree": "B.Tech",
                "start_year": 2015,
                "end_year": 2019
            }],
            "experiences_input": [{
                "role": "Backend Developer",
                "company": "StartupX",
                "start_date": "2020-01-01",
                "end_date": "2022-01-01",
                "description": "Worked on REST APIs.",
                "ongoing": False
            }],
            "languages_input": [{"name": "English", "proficiency": "fluent"}],
            "portfolios_input": [{"title": "Blog App", "description": "A blog my demo project", "project_link": "https://demo.com"}],
            "social_links_input": {"github_url": "https://github.com/janedoe"},
            "verification_input": {"email_verified": True}
        }
        response = self.client.post(self.create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Confirm skills, education, etc created
        profile = FreelancerProfile.objects.get(user=self.user)
        self.assertEqual(profile.first_name, "Jane")
        self.assertTrue(profile.skills.filter(name="Python").exists())

    def test_duplicate_freelancer_profile(self):
        FreelancerProfile.objects.create(
            user=self.user,
            first_name="Jane",
            last_name="Doe",
            location="Bangalore"
        )
        payload = {
            "first_name": "Jane",
            "last_name": "Doe",
            "about": "Duplicate profile should fail.",
            "location": "Bangalore",
            "is_available": True,
        }
        response = self.client.post(self.create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Profile already exists", str(response.data))

    def test_retrieve_me_profile(self):
        FreelancerProfile.objects.create(
            user=self.user,
            first_name="Jane",
            last_name="Doe",
            location="Bangalore"
        )
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Jane")
        self.assertEqual(response.data["last_name"], "Doe")

    def test_update_me_profile(self):
        FreelancerProfile.objects.create(
            user=self.user,
            first_name="Jane",
            last_name="Doe",
            location="Bangalore"
        )
        payload = {"about": "Updated profile info", "age": 30}
        response = self.client.patch(self.me_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["about"], "Updated profile info")
        self.assertEqual(response.data["age"], 30)

    def test_owner_permission_enforcement(self):
        other_user = User.objects.create_user(
            email="other@test.com", password="password", role="FREELANCER", is_verified=True)
        profile = FreelancerProfile.objects.create(
            user=other_user,
            first_name="Other",
            last_name="User",
            location="Delhi"
        )
        # Try updating another user's profile directly (should be forbidden)
        url = f'/api/v1/profiles/freelancer/profile-setup/{profile.id}/'
        response = self.client.patch(url, {"about": "Should fail"}, format='json')
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

class ClientProfileSetupTests(APITestCase):
    def setUp(self):
        self.create_url = '/api/v1/profiles/client/profile-setup/'
        self.me_url = '/api/v1/profiles/client/profile-setup/me/'
        self.user = User.objects.create_user(email='clientuser@test.com', password='testpass', role='CLIENT', is_verified=True)
        self.client.force_authenticate(user=self.user)

    def test_create_client_profile(self):
        payload = {
            "account_type": "business",
            "first_name": "Acme",
            "last_name": "Corp",
            "company_name": "Acme Solutions",
            "country": "India",
            "location": "Delhi",
            "industry": "IT",
            "website": "https://acme.com",
            "company_description": "Enterprise client",
            "project_types": ["web"],
            "budget_range": "₹2L-₹5L",
            "project_frequency": "monthly",
            "preferred_communications": ["email"],
            "working_hours": "10am-6pm IST",
            "business_goals": ["automation"],
            "current_challenges": ["hiring"],
            "previous_experiences": "good",
            "expected_timeline": "3 months",
            "quality_importance": "high",
            "payment_method": "bank-transfer",
            "monthly_budget": "560000",
            "project_budget": "3000000",
            "payment_timing": "upfront"
        }
        response = self.client.post(self.create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["company_name"], "Acme Solutions")
        self.assertEqual(response.data["account_type"], "business")

    def test_duplicate_client_profile(self):
        ClientProfile.objects.create(
            user=self.user, first_name="Acme", last_name="Corp", company_name="Acme Solutions",
            account_type="business", country="India", location="Delhi"
        )
        payload = {"first_name": "Acme", "last_name": "Corp", "company_name": "Acme Solutions", "account_type": "business",
                   "country": "India", "location": "Delhi"}
        response = self.client.post(self.create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Profile already exists", str(response.data))

    def test_retrieve_me_profile(self):
        ClientProfile.objects.create(
            user=self.user, first_name="Acme", last_name="Corp", company_name="Acme Solutions",
            account_type="business", country="India", location="Delhi"
        )
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["company_name"], "Acme Solutions")
        self.assertEqual(response.data["first_name"], "Acme")

    def test_update_me_profile(self):
        ClientProfile.objects.create(
            user=self.user, first_name="Acme", last_name="Corp", company_name="Acme Solutions",
            account_type="business", country="India", location="Delhi"
        )
        payload = {"company_description": "Updated desc", "industry": "Consulting"}
        response = self.client.patch(self.me_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["company_description"], "Updated desc")
        self.assertEqual(response.data["industry"], "Consulting")

    def test_owner_permission_enforcement(self):
        other_user = User.objects.create_user(email="otherclient@test.com", password="pass", role="CLIENT", is_verified=True)
        profile = ClientProfile.objects.create(user=other_user, first_name="Other", last_name="Client",
                                               company_name="OtherCo", account_type="personal",
                                               country="India", location="Chennai")
        url = f"/api/v1/profiles/client/profile-setup/{profile.id}/"
        response = self.client.patch(url, {"company_description": "Should fail"}, format='json')
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])
