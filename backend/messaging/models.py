from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from profiles.models import ClientProfile, FreelancerProfile
from gigs.models import ServiceOrder, ProposalOrder

User = settings.AUTH_USER_MODEL

class Conversation(models.Model):
    """
    Defines a one-to-one chat conversation between client and freelancer tied to an order,
    where order can be either a ServiceOrder or a ProposalOrder.
    """
    # Generic relation to either ServiceOrder or ProposalOrder
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    order = GenericForeignKey('content_type', 'object_id')

    # Explicit participant roles linked to your profile models
    client = models.ForeignKey(
        ClientProfile,
        on_delete=models.CASCADE,
        related_name='client_conversations'
    )
    freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name='freelancer_conversations'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # soft-delete / archival flag
    metadata = models.JSONField(blank=True, null=True)  # for future extensibility

    class Meta:
        # Unique conversation per order + participant pair, no duplicates allowed
        unique_together = ('content_type', 'object_id', 'client', 'freelancer')
        indexes = [
            models.Index(fields=['client']),
            models.Index(fields=['freelancer']),
            models.Index(fields=['content_type', 'object_id']),
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f"Conversation #{self.pk} for Order #{self.object_id} (Client {self.client.id}, Freelancer {self.freelancer.id})"

class Attachment(models.Model):
    file = models.FileField(upload_to='chat_attachments/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_name = models.CharField(max_length=255, blank=True)
    file_type = models.CharField(max_length=50, blank=True)  # MIME or extension
    file_size = models.PositiveIntegerField(null=True)

    thumbnail_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['-uploaded_at']
        indexes = [models.Index(fields=['uploaded_at'])]

    def save(self, *args, **kwargs):
        if self.file:
            self.file_name = self.file.name
            self.file_size = self.file.size
            try:
                self.file_type = self.file.file.content_type
            except AttributeError:
                self.file_type = ''
        super().save(*args, **kwargs)

    def __str__(self):
        return self.file_name or f"Attachment {self.pk}"

class Message(models.Model):
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('file', 'File'),
        ('payment', 'Payment'),
        ('voice', 'Voice'),
    ]

    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
        ('failed', 'Failed'),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    content = models.TextField(blank=True, help_text='Text content or description')

    attachment = models.ForeignKey(
        Attachment,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='messages'
    )

    payment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='For payment request messages'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent')

    is_edited = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # Soft delete support

    reactions = models.JSONField(default=dict, blank=True)  # emoji reactions: {"👍": 2, "❤️": 1}

    voice_duration = models.IntegerField(null=True, blank=True, help_text="Duration of voice message in seconds")
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender']),
        ]

    def __str__(self):
        return f"Message #{self.pk} in Conversation #{self.conversation.pk} from User #{self.sender_id}"

class ConversationReadStatus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversation_reads')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='read_statuses')
    last_read_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'conversation')

class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Client Acceptance'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    WORKFLOW_STEPS = [
        'planning', 'draft', 'submitted', 'negotiation',
        'accepted', 'started', 'milestone-1',
        'review', 'completed', 'paid',
    ]
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField()
    terms = models.TextField(blank=True)
    milestones = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    workflow_status = models.CharField(max_length=50, choices=[(step, step) for step in WORKFLOW_STEPS], default='planning')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    service_order = models.ForeignKey(
        ServiceOrder,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='contract'
    )
    proposal_order = models.ForeignKey(
        ProposalOrder,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='contract'
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(service_order__isnull=False, proposal_order__isnull=True) |
                    Q(service_order__isnull=True, proposal_order__isnull=False)
                ),
                name='contract_order_exclusive'
            )
        ]

class PaymentTerm(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='payment_terms')
    description = models.CharField(max_length=255)  # e.g. "First Installment", "Milestone 1", etc.
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contract} - {self.description} - {self.amount} ({self.status})"


class CallRecord(models.Model):
    CALL_TYPES = [
        ('voice', 'Voice'),
        ('video', 'Video')
        ]
    CALL_STATUSES = [
    ('ringing', 'Ringing'),
    ('ongoing', 'Ongoing'),
    ('completed', 'Completed'),
    ('missed', 'Missed'),
    ('rejected', 'Rejected'),
    ('cancelled', 'Cancelled')
    ]

    caller = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='calls_made', on_delete=models.CASCADE)
    callee = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='calls_received', on_delete=models.CASCADE)
    call_type = models.CharField(max_length=10, choices=CALL_TYPES)
    status = models.CharField(max_length=10, choices=CALL_STATUSES)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.end_time and self.start_time:
            self.duration = int((self.end_time - self.start_time).total_seconds())
        super().save(*args, **kwargs)
