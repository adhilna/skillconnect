from rest_framework import serializers
from .models import Attachment, Message, Conversation

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



class ConversationSerializer(serializers.ModelSerializer):
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    freelancer_id = serializers.IntegerField(source='freelancer.id', read_only=True)
    order_type = serializers.SerializerMethodField()
    order_id = serializers.SerializerMethodField()

    client_name = serializers.SerializerMethodField()
    client_profile_pic = serializers.SerializerMethodField()

    freelancer_name = serializers.SerializerMethodField()
    freelancer_profile_pic = serializers.SerializerMethodField()

    service_title = serializers.SerializerMethodField()
    service_price = serializers.SerializerMethodField()
    service_deadline = serializers.SerializerMethodField()

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
            # 'last_message',
            'service_title',
            'service_price',
            'service_deadline',
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
