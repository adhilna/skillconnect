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
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id',
            'client_id',
            'freelancer_id',
            'order_type',
            'order_id',
            'is_active',
            'created_at',
            'updated_at',
            'metadata',
            'last_message',
        ]
        read_only_fields = ['created_at', 'updated_at', 'metadata', 'is_active']

    def get_order_type(self, obj):
        return obj.content_type.model

    def get_order_id(self, obj):
        return obj.object_id

    def get_last_message(self, obj):
        latest = obj.messages.order_by('-created_at').first()
        if latest:
            return {
                'id': latest.id,
                'content': latest.content,
                'timestamp': latest.created_at,
                'sender_id': latest.sender.id,
                'message_type': latest.message_type,
            }
        return None
