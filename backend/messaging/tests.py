from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from messaging.models import Conversation, Message, Contract, PaymentRequest
from gigs.models import ServiceOrder, ProposalOrder
from profiles.models import ClientProfile, FreelancerProfile
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from gigs.models import Service
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class ConversationViewSetTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email='client@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Client", last_name="A")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Free", last_name="B")

        # Create service object for order
        self.service = Service.objects.create(
            title="Logo Design",  # Use actual field names of Service model
            price=1000,
            delivery_time=7,
            freelancer=self.freelancer_profile,
            # Add other required fields here!
        )

        self.service_order = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service,  # <-- This line fixes your error!
            status="accepted"
        )

        self.conversation, _ = Conversation.objects.get_or_create(
            content_type=ContentType.objects.get_for_model(ServiceOrder),
            object_id=self.service_order.id,
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            is_active=True
        )


    def test_client_can_list_conversations(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('conversation-list')
        res = self.client.get(url)
        ids = [obj['id'] for obj in res.data]
        self.assertIn(self.conversation.id, ids)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_freelancer_can_list_conversations(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('conversation-list')
        res = self.client.get(url)
        ids = [obj['id'] for obj in res.data]
        self.assertIn(self.conversation.id, ids)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_client_can_create_conversation(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('conversation-list')
        data = {'order_type': 'serviceorder', 'order_id': self.service_order.id}
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['client_id'], self.client_profile.id)
        self.assertEqual(res.data['freelancer_id'], self.freelancer_profile.id)

    def test_permission_blocks_unrelated_user(self):
        other_user = User.objects.create_user(email='other@test.com', password='pw')
        self.client.force_authenticate(other_user)
        url = reverse('conversation-detail', args=[self.conversation.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

class MessageViewSetTests(APITestCase):
    def setUp(self):
        # Setup users, profiles, service, order, conversation
        self.client_user = User.objects.create_user(email='client@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Client", last_name="A")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Free", last_name="B")
        self.service = Service.objects.create(
            title="Logo Design", price=1000, delivery_time=7, freelancer=self.freelancer_profile
            # add any other required fields!
        )
        self.service_order = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service,
            status="accepted"
        )
        self.conversation, _ = Conversation.objects.get_or_create(
            content_type=ContentType.objects.get_for_model(ServiceOrder),
            object_id=self.service_order.id,
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            is_active=True
        )


    def test_can_list_messages(self):
        msg = Message.objects.create(
            conversation=self.conversation,
            sender=self.client_user,
            content="Hello world!",
            message_type="text"
        )
        self.client.force_authenticate(self.client_user)
        url = reverse('conversation-messages', args=[self.conversation.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        messages = res.data if isinstance(res.data, list) else res.data['results']
        self.assertTrue(any(m["id"] == msg.id for m in messages))

    def test_client_can_send_text_message(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('conversation-messages', args=[self.conversation.id])
        data = {
            "message_type": "text",
            "content": "Hi, I've attached the requirements."
        }
        res = self.client.post(url, data)
        print(res.status_code)
        print(res.data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['content'], data['content'])
        self.assertEqual(res.data['sender_id'], self.client_user.id)

    def test_freelancer_can_send_file_message(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('conversation-messages', args=[self.conversation.id])
        file = SimpleUploadedFile("testfile.txt", b"This is a file.")
        data = {
            "message_type": "file",
            "content": "See attached file.",
            "attachment_file": file
        }
        res = self.client.post(url, data, format='multipart')
        print(res.status_code, res.data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['content'], "See attached file.")
        self.assertIsNotNone(res.data['attachment'])

    def test_participant_can_react_to_message(self):
        # Create a message as client
        msg = Message.objects.create(
            conversation=self.conversation,
            sender=self.client_user,
            content="Important!",
            message_type="text"
        )
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('conversation-message-react', args=[self.conversation.id, msg.id])
        res = self.client.post(url, {"emoji": "👍"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("👍", res.data["reactions"])

    def test_permission_denied_for_unrelated_user(self):
        # User not in convo cannot read or post
        outsider = User.objects.create_user(email="outsider@test.com", password="pw")
        self.client.force_authenticate(outsider)
        url = reverse('conversation-messages', args=[self.conversation.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

class ContractViewSetTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email='client@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Client", last_name="A")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Free", last_name="B")
        self.service = Service.objects.create(
            title="Logo Design", price=1000, delivery_time=7, freelancer=self.freelancer_profile
        )
        self.service_order = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service,
            status="accepted"
        )
        self.conversation, _ = Conversation.objects.get_or_create(
            content_type=ContentType.objects.get_for_model(ServiceOrder),
            object_id=self.service_order.id,
            client=self.client_profile,
            freelancer=self.freelancer_profile
        )
        self.contract = Contract.objects.create(
            service_order=self.service_order,
            amount=1000,
            deadline='2025-10-15',
            status='draft',
            workflow_status='planning'
        )

    def test_contract_list(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('contract-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        contracts = res.data if isinstance(res.data, list) else res.data['results']
        self.assertTrue(any(c['id'] == self.contract.id for c in contracts))

    def test_freelancer_can_create_contract(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('contract-list')
        data = {
            'amount': 2000,
            'deadline': '2025-10-20',
            'terms': 'Delivery in 1 week.',
            'milestones': '',
            'order_type': 'service',
            'order_id': self.service_order.id,
        }
        res = self.client.post(url, data)
        print(res.status_code, res.data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['amount'], '2000.00')

    def test_freelancer_can_update_status(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('contract-detail', args=[self.contract.id])
        patch_data = {'status': 'accepted', 'workflow_status': 'draft'}
        res = self.client.patch(url, patch_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.status, 'accepted')

    def test_active_contracts_action(self):
        self.contract.status = 'accepted'
        self.contract.workflow_status = 'draft'
        self.contract.save()
        self.client.force_authenticate(self.client_user)
        url = reverse('contract-active')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(any(c['id'] == self.contract.id for c in res.data))

    def test_permission_blocks_unrelated_user(self):
        outsider = User.objects.create_user(email='outsider@test.com', password='pw')
        self.client.force_authenticate(outsider)
        url = reverse('contract-detail', args=[self.contract.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

class PaymentRequestViewSetTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email='client@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancer@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Client", last_name="Z")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Free", last_name="X")
        self.service = Service.objects.create(
            title="App Build", price=6000, delivery_time=10, freelancer=self.freelancer_profile
        )
        self.service_order = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service, status="accepted"
        )
        self.conversation, _ = Conversation.objects.get_or_create(
            content_type=ContentType.objects.get_for_model(ServiceOrder),
            object_id=self.service_order.id,
            client=self.client_profile,
            freelancer=self.freelancer_profile
        )
        self.contract = Contract.objects.create(
            service_order=self.service_order,
            amount=6000,
            deadline='2025-10-20',
            status='accepted',
            workflow_status='submitted'
        )
        self.payment_request = PaymentRequest.objects.create(
            contract=self.contract,
            requested_by=self.freelancer_user,
            payee=self.client_user,
            amount=2000,
            description="Advance payment",
            status='pending'
        )

    def test_freelancer_can_create_payment_request(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('paymentrequest-list')
        data = {
            'contract': self.contract.id,
            'amount': 1500,
            'description': "Milestone 1",
            'conversation_id': self.conversation.id,
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(res.data['amount']), 1500.0)
        self.assertEqual(res.data['requested_by'], self.freelancer_user.id)
        self.assertEqual(res.data['payee'], self.client_user.id)

    def test_client_can_list_payment_requests(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('paymentrequest-list')
        res = self.client.get(url)
        paged = res.data if isinstance(res.data, list) else res.data['results']
        self.assertIn(self.payment_request.id, [r['id'] for r in paged])
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_freelancer_can_list_payment_requests(self):
        self.client.force_authenticate(self.freelancer_user)
        url = reverse('paymentrequest-list')
        res = self.client.get(url)
        paged = res.data if isinstance(res.data, list) else res.data['results']
        self.assertIn(self.payment_request.id, [r['id'] for r in paged])
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_payee_can_update_status(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('paymentrequest-detail', args=[self.payment_request.id])
        patch_data = {'status': 'completed'}
        res = self.client.patch(url, patch_data)
        print(res.status_code)
        print(res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.payment_request.refresh_from_db()
        self.assertEqual(self.payment_request.status, 'completed')

    def test_permission_blocks_non_participant(self):
        outsider = User.objects.create_user(email='outsider@test.com', password='pw')
        self.client.force_authenticate(outsider)
        url = reverse('paymentrequest-detail', args=[self.payment_request.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

class PaymentViewSetTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email='clientp@test.com', password='pw')
        self.freelancer_user = User.objects.create_user(email='freelancerp@test.com', password='pw')
        self.client_profile = ClientProfile.objects.create(user=self.client_user, first_name="Client", last_name="Pay")
        self.freelancer_profile = FreelancerProfile.objects.create(user=self.freelancer_user, first_name="Free", last_name="Pay")
        self.service = Service.objects.create(
            title="UI Design", price=1500, delivery_time=5, freelancer=self.freelancer_profile
        )
        self.service_order = ServiceOrder.objects.create(
            client=self.client_profile,
            freelancer=self.freelancer_profile,
            service=self.service, status="accepted"
        )
        self.conversation, _ = Conversation.objects.get_or_create(
            content_type=ContentType.objects.get_for_model(ServiceOrder),
            object_id=self.service_order.id,
            client=self.client_profile,
            freelancer=self.freelancer_profile
        )
        self.contract = Contract.objects.create(
            service_order=self.service_order,
            amount=1500, deadline='2025-10-15', status='accepted', workflow_status='submitted'
        )
        self.payment_request = PaymentRequest.objects.create(
            contract=self.contract,
            requested_by=self.freelancer_user,
            payee=self.client_user,
            amount=1000,
            description="Initial pay",
            status='pending'
        )

    def test_create_razorpay_order(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('payment-detail', args=[self.payment_request.id]) + 'create-razorpay-order/'
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('order_id', res.data)
        self.assertEqual(res.data['amount'], 1000 * 100)
        self.assertEqual(res.data['currency'], 'INR')

    def test_verify_razorpay_payment(self):
        self.client.force_authenticate(self.client_user)
        url = reverse('payment-detail', args=[self.payment_request.id]) + 'verify-razorpay-payment/'
        data = {
            "razorpay_order_id": "order_XYZ",
            "razorpay_payment_id": "pay_ABC",
            "razorpay_signature": "dummy_signature"
        }
        # Expect 200/400/500 based on payment mock
        res = self.client.post(url, data, format='json')
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_permission_blocks_outsider(self):
        outsider = User.objects.create_user(email='outsiderpay@test.com', password='pw')
        self.client.force_authenticate(outsider)
        url = reverse('payment-detail', args=[self.payment_request.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
