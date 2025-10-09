from django.contrib.auth import get_user_model
User = get_user_model()
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Category, Skill
from gigs.models import Service, Proposal
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class ServiceViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.freelancer = FreelancerProfile.objects.create(user=self.user, first_name="John", last_name="Doe")
        self.category = Category.objects.create(name="Programming")
        self.skill = Skill.objects.create(name="Python")
        self.client.force_authenticate(self.user)

    def test_create_service(self):
        url = reverse('service-list')
        data = {
            "title": "Web App Development",
            "description": "I build web apps.",
            "category_id": self.category.id,
            "skills_input": [{"name": "Python"}],
            "price": "100.00",
            "delivery_time": 7,
            "revisions": 2
        }
        res = self.client.post(url, data, format='json')
        print(res.data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], "Web App Development")
        # Additional assertions can go here!

    def test_list_services(self):
        Service.objects.create(
            freelancer=self.freelancer,
            title="Test Service",
            description="Test Description",
            price="100.00",
            delivery_time=7,
            revisions=1,
            category=self.category
        )
        url = reverse('service-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(any(s['title'] == "Test Service" for s in res.data))

class ProposalViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='client@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.user, first_name="Alice", last_name="Corp")
        self.category = Category.objects.create(name="Design")
        self.skill = Skill.objects.create(name="Figma")
        self.client.force_authenticate(self.user)

    def test_create_proposal(self):
        url = reverse('proposal-list')
        data = {
            "title": "Design my website",
            "description": "Landing page design needed.",
            "category_id": self.category.id,
            "skills_input": [{"name": "Figma"}],
            "budget_min": "300.00",
            "budget_max": "500.00",
            "timeline_days": 14,
            "project_scope": "one_time",
            "is_urgent": True
        }
        res = self.client.post(url, data, format='json')
        print(res.data)  # For debugging
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], "Design my website")
        self.assertTrue(any(skill['name'] == "Figma" for skill in res.data['skills_output']))

    def test_list_proposals(self):
        Proposal.objects.create(
            client=self.client_profile,
            title="Old Proposal",
            description="Test",
            category=self.category,
            budget_min="100", budget_max="200",
            timeline_days=7,
        )
        url = reverse('proposal-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        # Use res.data for non-paginated, res.data['results'] for paginated
        self.assertTrue(any(p['title'] == "Old Proposal" for p in res.data))

