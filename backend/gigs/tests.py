from django.contrib.auth import get_user_model
User = get_user_model()
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Category, Skill
from gigs.models import Service, Proposal, ServiceOrder
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

class ExploreServicesViewSetTests(APITestCase):
    def setUp(self):
        user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.freelancer = FreelancerProfile.objects.create(user=user, first_name="John", last_name="Doe")
        self.category = Category.objects.create(name="Programming")
        self.skill_python = Skill.objects.create(name="Python")
        self.skill_django = Skill.objects.create(name="Django")

        s1 = Service.objects.create(
            freelancer=self.freelancer,
            title="Build Website",
            description="Use Django and Python",
            price=1000,
            delivery_time=5,
            revisions=1,
            category=self.category,
            is_active=True
        )
        s1.skills.add(self.skill_python, self.skill_django)

        s2 = Service.objects.create(
            freelancer=self.freelancer,
            title="Bug Fixing",
            description="Quick Django fixes",
            price=500,
            delivery_time=2,
            revisions=1,
            category=self.category,
            is_active=True
        )
        s2.skills.add(self.skill_django)

        self.client.force_authenticate(user)

    def test_filter_by_category(self):
        url = reverse('explore-services-list')
        res = self.client.get(url, {'category': self.category.id})
        self.assertEqual(res.status_code, 200)
        titles = [x['title'] for x in res.data['results']]
        self.assertIn("Build Website", titles)
        self.assertIn("Bug Fixing", titles)

    def test_filter_by_skill(self):
        url = reverse('explore-services-list')
        res = self.client.get(url, {'skills': 'Python'})
        self.assertEqual(res.status_code, 200)
        titles = [x['title'] for x in res.data['results']]
        self.assertIn("Build Website", titles)
        self.assertNotIn("Bug Fixing", titles)

    def test_search_title(self):
        url = reverse('explore-services-list')
        res = self.client.get(url, {'search': 'Bug'})
        self.assertTrue(any('Bug' in title for title in [x['title'] for x in res.data['results']]
))

    def test_order_by_price(self):
        url = reverse('explore-services-list')
        res = self.client.get(url, {'ordering': 'price'})
        prices = [float(x['price']) for x in res.data['results']]
        self.assertEqual(prices, sorted(prices))

class ExploreProposalsViewSetTests(APITestCase):
    def setUp(self):
        user = User.objects.create_user(email='client@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=user, first_name="Test", last_name="Client")
        self.category_design = Category.objects.create(name="Design")
        self.category_web = Category.objects.create(name="Web")
        self.skill_figma = Skill.objects.create(name="Figma")
        self.skill_python = Skill.objects.create(name="Python")
        self.skill_logo = Skill.objects.create(name="Logo Design") 

        prop1 = Proposal.objects.create(
            client=self.client_profile,
            title="Logo Design",
            description="Logo for startup.",
            category=self.category_design,
            budget_min="200",
            budget_max="500",
            timeline_days=7,
            is_active=True
        )
        prop2 = Proposal.objects.create(
            client=self.client_profile,
            title="Build Website",
            description="Django web service.",
            category=self.category_web,
            budget_min="900",
            budget_max="2500",
            timeline_days=20,
            is_active=True
        )
        prop1.required_skills.add(self.skill_figma)
        prop2.required_skills.add(self.skill_python)
        self.client.force_authenticate(user)

    def test_filter_by_category(self):
        url = reverse('explore-proposals-list')
        res = self.client.get(url, {'category': self.category_web.id})
        titles = [x['title'] for x in res.data['results']]
        self.assertIn("Build Website", titles)
        self.assertNotIn("Logo Design", titles)

    def test_filter_by_skill(self):
        url = reverse('explore-proposals-list')
        res = self.client.get(url, {'search': 'Logo Design'})
        titles = [x['title'] for x in res.data['results']]
        self.assertIn("Logo Design", titles)
        self.assertNotIn("Build Website", titles)


    def test_filter_by_min_budget(self):
        url = reverse('explore-proposals-list')
        res = self.client.get(url, {'min_budget': 800})
        titles = [x['title'] for x in res.data['results']]
        self.assertIn("Build Website", titles)
        self.assertNotIn("Logo Design", titles)

    def test_search_title(self):
        url = reverse('explore-proposals-list')
        res = self.client.get(url, {'search': 'Logo'})
        self.assertTrue(any('Logo' in x['title'] for x in res.data['results']))

    def test_order_by_budget_min(self):
        url = reverse('explore-proposals-list')
        res = self.client.get(url, {'ordering': 'budget_min'})
        budgets = [float(x['budget_min']) for x in res.data['results']]
        self.assertEqual(budgets, sorted(budgets))

class ServiceOrderViewSetTests(APITestCase):
    def setUp(self):
        # Set up one client, one freelancer, and one service (by freelancer)
        self.client_user = User.objects.create_user(email='client@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Test", last_name="Client")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Test", last_name="Freelancer")

        # NOTE: Use your actual Service model's field names here!
        self.service = Service.objects.create(
            title="Logo Design",                # Change field name as per your Service model
            description="Branding",             # Change if needed
            freelancer=self.freelancer_profile,  # Must match your Service model's FK
            price=1500,
            delivery_time=7 
        )

        # Orders (made by client for freelancer's service)
        self.order1 = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service,
            status="pending"
        )
        self.order_done = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service,
            status="completed"
        )

    def test_list_service_orders_for_freelancer_only(self):
        # Freelancer authenticates—should see their own service orders, not other's
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('serviceorder-list')
        res = self.client.get(url)
        ids = [order['id'] for order in res.data['results']]
        self.assertIn(self.order1.id, ids)
        self.assertIn(self.order_done.id, ids)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_client_cannot_list_any_orders(self):
        # Client authenticates—should see none (not a freelancer)
        self.client.force_authenticate(self.client_user)
        url = reverse('serviceorder-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 403)

    def test_create_service_order_by_client(self):
        # Client places order on a freelancer's service
        self.client.force_authenticate(self.client_user)
        url = reverse('serviceorder-list')
        data = {
            "service_id": self.service.id,
            "message": "Please deliver in 7 days"
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], "pending")
        self.assertEqual(res.data['service']['title'], "Logo Design")

    def test_freelancer_cannot_create_service_order(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('serviceorder-list')
        data = {
            "service_id": self.service.id,
            "message": "Should not work"
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_service_order_detail(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('serviceorder-detail', args=[self.order1.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['id'], self.order1.id)

    def test_partial_update_by_freelancer(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('serviceorder-detail', args=[self.order1.id])
        res = self.client.patch(url, {'status': 'accepted'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'accepted')

    def test_partial_update_rejected_for_client(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('serviceorder-detail', args=[self.order1.id])
        res = self.client.patch(url, {'status': 'accepted'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)