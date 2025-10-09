from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from messaging.models import Conversation, Message
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