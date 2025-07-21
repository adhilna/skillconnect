from django.db import models
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Category, Skill
import os
import uuid

def service_image_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    unique_name = f"{instance.freelancer.user.id}_service_{uuid.uuid4()}{ext}"
    return f"freelancers/service_images/{instance.freelancer.user.id}/{unique_name}"

class Service(models.Model):
    freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.CASCADE,
        related_name='services'
    )
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=2000)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    skills = models.ManyToManyField(Skill, blank=True, related_name='services')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.PositiveIntegerField(help_text="Delivery time in days")
    revisions = models.PositiveIntegerField(default=1)
    image = models.ImageField(
    upload_to=service_image_upload_path,
    null=True,
    blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.freelancer.user.username}"


class Proposal(models.Model):
    PROJECT_SCOPE_CHOICES = [
    ("one_time", "One-time"),
    ("ongoing", "Ongoing"),
]
    client = models.ForeignKey(
        ClientProfile,
        on_delete=models.CASCADE,
        related_name='proposals'
    )
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=2000)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    required_skills = models.ManyToManyField(Skill, blank=True, related_name='proposals')
    budget_min = models.DecimalField(max_digits=10, decimal_places=2)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2)
    timeline_days = models.PositiveIntegerField()
    project_scope = models.CharField(
    max_length=20,
    choices=PROJECT_SCOPE_CHOICES,
    blank=True,
    null=True
    )
    is_urgent = models.BooleanField(default=False)

    applied_freelancers = models.ManyToManyField(
    FreelancerProfile,
    related_name="applied_proposals",
    blank=True
    )
    selected_freelancer = models.ForeignKey(
        FreelancerProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='awarded_proposals'
    )
    status = models.CharField(
        max_length=24,
        choices=[
            ("open", "Open"),
            ("in_progress", "In Progress"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled")
        ],
        default="open"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
