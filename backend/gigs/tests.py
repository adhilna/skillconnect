from django.contrib.auth import get_user_model
User = get_user_model()
from profiles.models import FreelancerProfile
from core.models import Category, Skill
from gigs.models import Service
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

