from rest_framework import serializers
from .models import Attachment, Message, Conversation, ConversationReadStatus, Contract
from gigs.models import ServiceOrder, ProposalOrder
from django.shortcuts import get_object_or_404

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = [
            'id',
            'file',
            'file_name',
            'file_type',
            'file_size',
            'thumbnail_url',
            'uploaded_at',
        ]
        read_only_fields = ['file_name', 'file_type', 'file_size', 'thumbnail_url', 'uploaded_at']

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    attachment = AttachmentSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'conversation',
            'sender_id',
            'message_type',
            'content',
            'attachment',
            'payment_amount',
            'payment_status',
            'created_at',
            'updated_at',
            'delivered_at',
            'read_at',
            'status',
            'is_edited',
            'is_active',
            'reactions',
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'delivered_at', 
            'read_at', 'status', 'reactions', 'is_edited',
            'is_active'
        ]

class MessageCreateSerializer(serializers.ModelSerializer):
    attachment_file = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Message
        fields = [
            'message_type',
            'content',
            'attachment_file',
            'payment_amount',
            'payment_status',
        ]

    def validate(self, data):
        # Example: ensure that if message_type is 'file', attachment_file must be present
        if data.get('message_type') == 'file' and not data.get('attachment_file'):
            raise serializers.ValidationError("attachment_file is required when message_type is 'file'.")
        return data

    def create(self, validated_data):
        request = self.context['request']
        sender = request.user
        conversation = self.context.get('conversation')
        if conversation is None:
            raise serializers.ValidationError("Conversation context is required.")

        attachment_file = validated_data.pop('attachment_file', None)
        attachment = None

        # Remove keys if present to avoid duplicates
        validated_data.pop('sender', None)
        validated_data.pop('conversation', None)

        if attachment_file:
            attachment = Attachment.objects.create(file=attachment_file)

        message = Message.objects.create(
            sender=sender,
            conversation=conversation,
            attachment=attachment,
            **validated_data
        )
        return message

class LastMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id')

    class Meta:
        model = Message
        fields = ['id', 'content', 'created_at', 'sender_id']

class ConversationSerializer(serializers.ModelSerializer):
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    freelancer_id = serializers.IntegerField(source='freelancer.id', read_only=True)
    order_type = serializers.SerializerMethodField()
    order_id = serializers.SerializerMethodField()
    service_order_id = serializers.SerializerMethodField()
    proposal_order_id = serializers.SerializerMethodField()

    client_name = serializers.SerializerMethodField()
    client_profile_pic = serializers.SerializerMethodField()

    freelancer_name = serializers.SerializerMethodField()
    freelancer_profile_pic = serializers.SerializerMethodField()

    service_title = serializers.SerializerMethodField()
    service_price = serializers.SerializerMethodField()
    service_deadline = serializers.SerializerMethodField()

    last_message = serializers.SerializerMethodField()

    unread_count = serializers.SerializerMethodField()

    # Keep last_message or remove it, up to you

    class Meta:
        model = Conversation
        fields = [
            'id',
            'client_id',
            'client_name',
            'client_profile_pic',
            'freelancer_id',
            'freelancer_name',
            'freelancer_profile_pic',
            'order_type',
            'order_id',
            'is_active',
            'created_at',
            'updated_at',
            'metadata',
            'last_message',
            'unread_count',
            'service_title',
            'service_price',
            'service_deadline',
            'service_order_id',
            'proposal_order_id',

        ]
        read_only_fields = ['created_at', 'updated_at', 'metadata', 'is_active']

    def get_order_type(self, obj):
        return obj.content_type.model

    def get_order_id(self, obj):
        return obj.object_id

    def get_client_name(self, obj):
        client = obj.client
        if client:
            first = getattr(client, 'first_name', '')
            last = getattr(client, 'last_name', '')
            full_name = f"{first} {last}".strip()
            return full_name
        return None

    def get_client_profile_pic(self, obj):
        if obj.client and obj.client.profile_picture:
            # Assuming profile_picture is an ImageField or URLField
            request = self.context.get('request')
            url = obj.client.profile_picture.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_freelancer_name(self, obj):
        freelancer = obj.freelancer
        if freelancer:
            first = getattr(freelancer, 'first_name', '')
            last = getattr(freelancer, 'last_name', '')
            full_name = f"{first} {last}".strip()
            return full_name
        return None

    def get_freelancer_profile_pic(self, obj):
        if obj.freelancer and obj.freelancer.profile_picture:
            request = self.context.get('request')
            url = obj.freelancer.profile_picture.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_service_title(self, obj):
        order = self._get_order(obj)
        if order:
            order_type = obj.content_type.model
            if order_type == 'serviceorder':
                service = getattr(order, 'service', None)
                if service:
                    return service.title
            elif order_type == 'proposalorder':
                proposal = getattr(order, 'proposal', None)
                if proposal:
                    return getattr(proposal, 'title', None)
        return None

    def get_service_price(self, obj):
        order = self._get_order(obj)
        if order:
            order_type = obj.content_type.model
            if order_type == 'serviceorder':
                service = getattr(order, 'service', None)
                if service and hasattr(service, 'price'):
                    return f"${service.price}"
            elif order_type == 'proposalorder':
                proposal = getattr(order, 'proposal', None)
                if proposal:
                    budget_min = getattr(proposal, 'budget_min', None)
                    budget_max = getattr(proposal, 'budget_max', None)
                    if budget_min and budget_max:
                        return f"${budget_min} - ${budget_max}"
                    elif budget_min:
                        return f"From ${budget_min}"
        return None

    def get_service_deadline(self, obj):
        order = self._get_order(obj)
        if order:
            order_type = obj.content_type.model
            if order_type == 'serviceorder':
                service = getattr(order, 'service', None)
                if service and hasattr(service, 'delivery_time'):
                    return f"{service.delivery_time} days"
            elif order_type == 'proposalorder':
                proposal = getattr(order, 'proposal', None)
                if proposal:
                    timeline = getattr(proposal, 'timeline_days', None)  # or whatever deadline field exists
                    if timeline:
                        return f"{timeline} days"
        return None

    def _get_order(self, obj):
        """
        Helper to fetch the actual order instance related to the conversation
        using GenericForeignKey content_type + object_id
        """
        return obj.content_type.get_object_for_this_type(id=obj.object_id)

    def get_last_message(self, obj):
        last_msg = obj.messages.filter(is_active=True).order_by('-created_at').first()
        if last_msg:
            return LastMessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request').user
        if not user.is_authenticated:
            return 0

        try:
            last_read = obj.read_statuses.get(user=user).last_read_at
        except ConversationReadStatus.DoesNotExist:
            last_read = None

        if last_read:
            unread = obj.messages.filter(created_at__gt=last_read, is_active=True).exclude(sender=user).count()
        else:
            unread = obj.messages.exclude(sender=user).count()
        return unread

    def get_service_order_id(self, obj):
        if obj.content_type.model == 'serviceorder':
            return obj.object_id
        return None

    def get_proposal_order_id(self, obj):
        if obj.content_type.model == 'proposalorder':
            return obj.object_id
        return None

class ContractSerializer(serializers.ModelSerializer):
    service_order = serializers.PrimaryKeyRelatedField(
        queryset=ServiceOrder.objects.all(),
        required=False,
        allow_null=True
    )
    proposal_order = serializers.PrimaryKeyRelatedField(
        queryset=ProposalOrder.objects.all(),
        required=False,
        allow_null=True
    )
    class Meta:
        model = Contract
        fields = [
            'id',
            'amount',
            'deadline',
            'terms',
            'milestones',
            'status',
            'workflow_status',
            'service_order',
            'proposal_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        request = self.context.get('request')

        order_type = None
        order_id = None

        if request:
            order_type = request.data.get('order_type')
            order_id = request.data.get('order_id')

        # Fallback on update (PATCH) if values not provided in request
        if (not order_type or not order_id) and self.instance:
            if self.instance.service_order_id:
                order_type = 'service'
                order_id = self.instance.service_order_id
            elif self.instance.proposal_order_id:
                order_type = 'proposal'
                order_id = self.instance.proposal_order_id

        if order_type == 'service':
            service_order = get_object_or_404(ServiceOrder, id=order_id)
            data['service_order'] = service_order
            data['proposal_order'] = None
        elif order_type == 'proposal':
            proposal_order = get_object_or_404(ProposalOrder, id=order_id)
            data['proposal_order'] = proposal_order
            data['service_order'] = None
        else:
            raise serializers.ValidationError({
                "order_type": "Must be 'service' or 'proposal'."
            })

        # Validate only one FK present
        if bool(data.get('service_order')) == bool(data.get('proposal_order')):
            raise serializers.ValidationError(
                "Exactly one of 'service_order' or 'proposal_order' must be specified."
            )

        return data
