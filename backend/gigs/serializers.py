from rest_framework import serializers
from .models import Service, Proposal
from profiles.serializers import FreelancerProfileSetupSerializer
from profiles.models import FreelancerProfile, ClientProfile
from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
import json


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


from core.models import Skill  # adjust import as needed
import json

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

