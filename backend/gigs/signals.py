# gigs/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

from .models import ServiceOrder, ProposalOrder
from gigs.utils import create_conversation_if_not_exists


@receiver(post_save, sender=ServiceOrder)
def service_order_post_save(sender, instance, created, **kwargs):
    # Trigger only if status changed to "accepted" (and not when the object is first created)
    if instance.status.lower() == 'accepted':
        # Attempt to create or get existing conversation
        create_conversation_if_not_exists(instance)


@receiver(post_save, sender=ProposalOrder)
def proposal_order_post_save(sender, instance, created, **kwargs):
    if instance.status.lower() == 'accepted':
        create_conversation_if_not_exists(instance)
