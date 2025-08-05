from django.contrib.contenttypes.models import ContentType
from messaging.models import Conversation

def create_conversation_if_not_exists(order):
    content_type = ContentType.objects.get_for_model(order.__class__)
    # Use profile instances as client and freelancer, never User objects
    client_profile = order.client
    # For ServiceOrder, freelancer is order.service.freelancer; for ProposalOrder, it's order.freelancer
    if hasattr(order, 'service'):
        freelancer_profile = order.service.freelancer
    else:
        freelancer_profile = order.freelancer  # e.g., ProposalOrder.freelancer

    conversation, created = Conversation.objects.get_or_create(
        content_type=content_type,
        object_id=order.id,
        client=client_profile,
        freelancer=freelancer_profile,
        defaults={'is_active': True}
    )
    return conversation
