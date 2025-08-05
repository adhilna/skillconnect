from rest_framework import serializers
from .models import Service, Proposal, ServiceOrder, ProposalOrder
from profiles.serializers import FreelancerProfileSetupSerializer, FreelancerPublicDetailSerializer, ClientPublicMinimalSerializer, ClientPublicDetailSerializer, FreelancerPublicMinimalSerializer
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ServiceSerializer(serializers.ModelSerializer):
    skills_output = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    freelancer = FreelancerProfileSetupSerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'skills_output', 'freelancer',
            'price', 'delivery_time', 'revisions', 'image',
            'is_featured', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'freelancer', 'created_at', 'updated_at']

    def get_skills_output(self, obj):
        return [{"id": skill.id, "name": skill.name} for skill in obj.skills.all()] # Not needed in response

    def process_skills_input(self, raw):
        try:
            if isinstance(raw, list) and len(raw) == 1 and isinstance(raw[0], str):
                parsed = json.loads(raw[0])
            elif isinstance(raw, str):
                parsed = json.loads(raw)
            else:
                parsed = raw

            if isinstance(parsed, list) and len(parsed) == 1 and isinstance(parsed[0], list):
                parsed = parsed[0]

            if not all(isinstance(item, dict) and 'name' in item for item in parsed):
                raise serializers.ValidationError("Each skill must be a dictionary with a 'name' key.")
            return parsed
        except Exception:
            raise serializers.ValidationError({'skills_input': 'Invalid skills format'})

    def create(self, validated_data):
        request = self.context.get('request')
        raw_skills = request.data.get('skills_input', [])
        skills_data = self.process_skills_input(raw_skills)

        freelancer = validated_data.pop('freelancer', None)

        service = Service.objects.create(
            freelancer=freelancer,
            **validated_data
        )
        for skill_dict in skills_data:
            skill, _ = Skill.objects.get_or_create(name=skill_dict['name'])
            service.skills.add(skill)
        return service

    def update(self, instance, validated_data):
        request = self.context.get('request')
        raw_skills = request.data.get('skills_input', [])
        skills_data = self.process_skills_input(raw_skills)

        category = validated_data.pop('category', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if category:
            instance.category = category
        instance.save()

        instance.skills.clear()

        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                instance.skills.add(skill_obj)

        return instance

class ProposalSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)
    required_skills = SkillSerializer(many=True, read_only=True)
    skills_input = serializers.JSONField(write_only=True, required=False)
    skills_output = serializers.SerializerMethodField()

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )
    applied_freelancers = serializers.StringRelatedField(many=True, read_only=True)
    selected_freelancer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Proposal
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'required_skills', 'skills_input', 'skills_output',
            'budget_min', 'budget_max', 'timeline_days', 'project_scope', 'is_urgent',
            'client', 'applied_freelancers', 'selected_freelancer',
            'status', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'client', 'applied_freelancers', 'selected_freelancer',
            'created_at', 'updated_at'
        ]

    def get_skills_output(self, obj):
        return [{"id": skill.id, "name": skill.name} for skill in obj.required_skills.all()]

    def process_skills_input(self, raw):
        try:
            if isinstance(raw, list) and len(raw) == 1 and isinstance(raw[0], str):
                parsed = json.loads(raw[0])
            elif isinstance(raw, str):
                parsed = json.loads(raw)
            else:
                parsed = raw

            if isinstance(parsed, list) and len(parsed) == 1 and isinstance(parsed[0], list):
                parsed = parsed[0]

            if not all(isinstance(item, dict) and 'name' in item for item in parsed):
                raise serializers.ValidationError("Each skill must be a dictionary with a 'name' key.")
            return parsed
        except Exception:
            raise serializers.ValidationError({'skills_input': 'Invalid skills format'})

    def create(self, validated_data):
        skills_data_raw = validated_data.pop('skills_input', [])
        skills_data = self.process_skills_input(skills_data_raw)

        request = self.context.get('request')
        client_profile = ClientProfile.objects.get(user=request.user)
        validated_data['client'] = client_profile

        proposal = Proposal.objects.create(**validated_data)

        for skill_dict in skills_data:
            skill, _ = Skill.objects.get_or_create(name=skill_dict['name'])
            proposal.required_skills.add(skill)

        return proposal

    def update(self, instance, validated_data):
        raw_skills = validated_data.pop('skills_input', [])
        skills_data = self.process_skills_input(raw_skills)

        category = validated_data.pop('category', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if category:
            instance.category = category
        instance.save()
        instance.required_skills.clear()

        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                instance.required_skills.add(skill_obj)

        return instance

class ExploreServiceSerializer(serializers.ModelSerializer):
    freelancer = FreelancerPublicDetailSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    skills_output = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'category', 'skills_output', 'freelancer', 'price', 'delivery_time', 'image', 'is_featured']

    def get_skills_output(self, obj):
        return [{"id": skill.id, "name": skill.name} for skill in obj.skills.all()]

class ExploreProposalSerializer(serializers.ModelSerializer):
    client = ClientPublicDetailSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    skills_output = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = ['id', 'title', 'description', 'category', 'category_id',
            'skills_output', 'budget_min', 'budget_max', 'timeline_days',
            'project_scope', 'is_urgent', 'client',
            'status', 'is_active', 'created_at', 'updated_at']

    def get_skills_output(self, obj):
        return [{"id": skill.id, "name": skill.name} for skill in obj.required_skills.all()]

class ServiceOrderSerializer(serializers.ModelSerializer):
    client = ClientPublicMinimalSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)

    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True,
        required=True
    )
    message = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=ServiceOrder.STATUS_CHOICES, required=False)

    class Meta:
        model = ServiceOrder
        fields = [
            'id',
            'client',
            'freelancer',
            'service',
            'service_id',
            'message',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'client', 'freelancer', 'service', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        client_profile = request.user.client_profile
        service = validated_data['service']
        message = validated_data.get('message', '')

        order = ServiceOrder.objects.create(
            client=client_profile,
            freelancer=service.freelancer,
            service=service,
            message=message,
            status='pending'
        )

        # Send real-time notification via Channels
        channel_layer = get_channel_layer()
        group_name = f"user_{order.freelancer.user.id}"

        notification_data = {
            'type': 'send_notification',
            'message': {
                'id': order.id,
                'title': order.service.title,
                'client': str(order.client),
                'status': order.status,
                'message': order.message,
                'created_at': str(order.created_at),
                'text': f"New order received from {order.client} for service '{order.service.title}'."
            }
        }

        async_to_sync(channel_layer.group_send)(group_name, notification_data)

        return order

    def validate(self, attrs):
        # request = self.context.get('request')
        # client_profile = request.user.client_profile
        # service = attrs.get('service')

        # # Prevent duplicate active orders (pending or accepted) by same client & service
        # if ServiceOrder.objects.filter(
        #     client=client_profile,
        #     service=service,
        #     status__in=['pending', 'accepted']
        # ).exists():
        #     raise serializers.ValidationError("You already have an active order for this service.")

        return attrs

    def validate_status(self, value):
        # instance = getattr(self, 'instance', None)
        # if instance:
        #     current_status = instance.status.lower()
        #     new_status = value.lower()

        #     allowed_transitions = {
        #         'pending': ['accepted', 'rejected'],
        #         'accepted': ['completed', 'canceled'],
        #         'rejected': [],
        #         'completed': [],
        #         'canceled': [],
        #     }

        #     if current_status not in allowed_transitions:
        #         raise serializers.ValidationError(f"Unknown current status '{current_status}'.")

        #     if new_status not in allowed_transitions[current_status]:
        #         raise serializers.ValidationError(
        #             f"Order status can only be changed from '{current_status}' to one of {allowed_transitions[current_status]}."
        #         )
        return value

class ProposalOrderSerializer(serializers.ModelSerializer):
    proposal = ProposalSerializer(read_only=True)
    client = ClientPublicMinimalSerializer(read_only=True)
    freelancer = FreelancerPublicMinimalSerializer(read_only=True)

    proposal_id = serializers.PrimaryKeyRelatedField(
        queryset=Proposal.objects.all(),
        source='proposal',
        write_only=True
    )
    message = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=ProposalOrder.STATUS_CHOICES, required=False)

    class Meta:
        model = ProposalOrder
        fields = [
            'id', 'proposal', 'proposal_id', 'client', 'freelancer', 'message',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'proposal', 'client', 'freelancer', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        freelancer_profile = request.user.freelancer_profile
        proposal = validated_data['proposal']
        client_profile = proposal.client  # Proposal already has client
        message = validated_data.get('message', '')

        order = ProposalOrder.objects.create(
            proposal=proposal,
            client=client_profile,
            freelancer=freelancer_profile,
            message=message,
            status='pending'
        )
        # (Optional: add notifications here)
        return order

    def validate(self, attrs):
        # (Optional: Add validation to prevent multiple active applications by the same freelancer)
        return attrs
