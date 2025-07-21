from rest_framework import serializers
from .models import Service, Proposal
from profiles.serializers import FreelancerProfileSetupSerializer
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
import json


class ServiceSerializer(serializers.ModelSerializer):
    skills_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    skills_output = SkillSerializer(source='skills', many=True, read_only=True, required=False)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )
    freelancer = FreelancerProfileSetupSerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'skills_input', 'skills_output', 'freelancer',
            'price', 'delivery_time', 'revisions', 'image',
            'is_featured', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'freelancer', 'created_at', 'updated_at']

    def create(self, validated_data):
        skills_data = validated_data.pop('skills_input', [])
        if isinstance(skills_data, str):
            try:
                skills_data = json.loads(skills_data)
            except Exception:
                raise serializers.ValidationError({'skills_input': 'Invalid JSON.'})
        category = validated_data.pop('category', None)
        user = self.context['request'].user
        freelancer_profile = getattr(user, 'freelancer_profile', None)

        if not freelancer_profile:
            raise serializers.ValidationError("Freelancer profile not found for user.")

        service = Service.objects.create(
            freelancer=freelancer_profile,
            category=category,
            **validated_data
        )

        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                service.skills.add(skill_obj)

        return service


    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills_input', [])
        if isinstance(skills_data, str):
            try:
                skills_data = json.loads(skills_data)
            except Exception:
                raise serializers.ValidationError({'skills_input': 'Invalid JSON.'})
        category = validated_data.pop('category', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if category:
            instance.category = category
        instance.save()

        if skills_data:
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
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        source='required_skills'
    )
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
            'required_skills', 'skill_ids', 'budget_min', 'budget_max',
            'timeline_days', 'project_scope', 'is_urgent',
            'client', 'applied_freelancers', 'selected_freelancer',
            'status', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'client', 'applied_freelancers', 'selected_freelancer',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        client_profile = ClientProfile.objects.get(user=request.user)
        validated_data['client'] = client_profile
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
