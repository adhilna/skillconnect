from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Gig(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gigs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey('core.Category', on_delete=models.SET_NULL, null=True, blank=True)
    skills_required = models.ManyToManyField('core.Skill')
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=50, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

