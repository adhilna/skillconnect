from rest_framework import serializers
from django.db import transaction
from .models import (
    FreelancerProfile, ClientProfile, Verification, Education,
    Experience, Language, Portfolio, SocialLinks
)
from core.models import Skill
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.core.validators import URLValidator
from rest_framework.exceptions import ValidationError
from .constants import ALLOWED_INDUSTRIES, ALLOWED_COMPANY_SIZES


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = ['id', 'email_verified', 'phone_verified', 'id_verified', 'video_verified']

class EducationSerializer(serializers.ModelSerializer):
    certificate = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Education
        fields = ['id', 'college', 'degree', 'year', 'certificate']

    def to_internal_value(self, data):
        print(f"Education data: {data}")
        certificate = data.get('certificate')
        print(f"Education certificate: {certificate} ({type(certificate)})")
        if isinstance(certificate, (InMemoryUploadedFile, TemporaryUploadedFile)):
            data['certificate'] = certificate
        elif certificate is None or certificate == '':
            data['certificate'] = None
        elif isinstance(certificate, str):
            data['certificate'] = certificate
        else:
            raise serializers.ValidationError({"certificate": f"Invalid certificate value: {certificate}"})
        return super().to_internal_value(data)

class ExperienceSerializer(serializers.ModelSerializer):
    certificate = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Experience
        fields = ['id', 'company', 'role', 'start_date', 'end_date', 'ongoing', 'description', 'certificate']

    def to_internal_value(self, data):
        print(f"Experience data: {data}")
        certificate = data.get('certificate')
        print(f"Experience certificate: {certificate} ({type(certificate)})")
        if isinstance(certificate, (InMemoryUploadedFile, TemporaryUploadedFile)):
            data['certificate'] = certificate
        elif certificate is None or certificate == '':
            data['certificate'] = None
        elif isinstance(certificate, str):
            data['certificate'] = certificate
        else:
            raise serializers.ValidationError({"certificate": f"Invalid certificate value: {certificate}"})
        return super().to_internal_value(data)

class LanguageSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Language
        fields = ['id', 'profile', 'name', 'proficiency']

class PortfolioSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Portfolio
        fields = [
            'id', 'profile', 'title', 'description', 'project_link'
        ]

class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = ['github_url', 'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url']

# ----------------------------
# MAIN PROFILE SERIALIZERS
# ----------------------------

class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    skills = serializers.ListField(
        child=serializers.CharField(),  # Accept list of skill names
        write_only=True
    )
    educations = EducationSerializer(many=True, required=False)
    experiences = ExperienceSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True)
    portfolios = PortfolioSerializer(many=True)
    verifications = VerificationSerializer()
    social_links = SocialLinksSerializer()

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("First name must contain only letters.")
        return value

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Last name must contain only letters.")
        return value

    def validate_age(self, value):
        if value is not None and (value < 18 or value > 120):
            raise serializers.ValidationError("Age must be between 18 and 120.")
        return value

    def validate_social_links(self, value):
        validator = URLValidator()
        for field in ['github_url', 'linkedin_url']:
            url = value.get(field)
            if url:
                try:
                    validator(url)
                except ValidationError:
                    raise serializers.ValidationError({field: 'Invalid URL'})
        return value

    class Meta:
        model = FreelancerProfile
        fields = fields = [
            'id',
            'user',
            'first_name',
            'last_name',
            'profile_picture',
            'about',
            'age',
            'location',
            'skills',
            'verifications',
            'is_available',
            'created_at',
            'updated_at',
            'educations',
            'experiences',
            'languages',
            'portfolios',
            'social_links'
        ]

    @transaction.atomic
    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        languages_data = validated_data.pop('languages', [])
        portfolios_data = validated_data.pop('portfolios', [])
        social_links_data = validated_data.pop('social_links', {})
        verifications_data = validated_data.pop('verifications', {})

        user = self.context['request'].user
        profile = FreelancerProfile.objects.create(user=user, **validated_data)

        SocialLinks.objects.create(user=user, **social_links_data)
        verification = Verification.objects.create(**verifications_data)
        profile.verification = verification
        profile.save()

        for skill in skills_data:
            skill_obj, _ = Skill.objects.get_or_create(name=skill.strip())
            profile.skills.add(skill_obj)

        # FK: Educations
        for edu in educations_data:
            Education.objects.create(profile=profile, **edu)

        # FK: Experiences
        for exp in experiences_data:
            Experience.objects.create(profile=profile, **exp)

        # FK: Languages
        for lang in languages_data:
            Language.objects.create(profile=profile, **lang)

        # FK: Portfolios
        for port in portfolios_data:
            Portfolio.objects.create(profile=profile, **port)

        return profile

    @transaction.atomic
    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills', [])
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        languages_data = validated_data.pop('languages', [])
        portfolios_data = validated_data.pop('portfolios', [])
        social_links_data = validated_data.pop('social_links', {})
        verifications_data = validated_data.pop('verifications', {})

        # Update direct fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update ManyToMany: Skills
        instance.skills.clear()
        for skill in skills_data:
            skill_obj, _ = Skill.objects.get_or_create(name=skill.strip())
            instance.skills.add(skill_obj)

        # Update educations
        instance.educations.all().delete()
        for edu_data in educations_data:
            Education.objects.create(profile=instance, **edu_data)

        # Update experiences
        instance.experiences.all().delete()
        for exp_data in experiences_data:
            Experience.objects.create(profile=instance, **exp_data)

        # Update FK: Languages
        instance.languages.all().delete()
        for lang in languages_data:
            Language.objects.create(profile=instance, **lang)

        # Update FK: Portfolios
        instance.portfolios.all().delete()
        for port in portfolios_data:
            Portfolio.objects.create(profile=instance, **port)

        # Update or create SocialLinks (OneToOne)
        if social_links_data:
            SocialLinks.objects.update_or_create(profile=instance, defaults=social_links_data)

        if verifications_data:
            if instance.verification:
                VerificationSerializer().update(instance.verification, verifications_data)
            else:
                verification = Verification.objects.create(**verifications_data)
                instance.verification = verification
                instance.save()
        return instance

class ClientProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    verification = VerificationSerializer(required=False)

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("First name must contain only letters.")
        return value

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Last name must contain only letters.")
        return value

    def validate_website(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Website must start with http:// or https://")
        return value

    def validate_monthly_budget(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Monthly budget must be positive.")
        return value

    def validate_payment_method(self, value):
        valid_methods = ['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'stripe', '']
        if value not in valid_methods:
            raise serializers.ValidationError(f"Payment method must be one of: {', '.join(valid_methods)}")
        return value

    def validate_account_type(self, value):
        valid_types = ['personal', 'business']
        if value not in valid_types:
            raise serializers.ValidationError(f"Account type must be one of: {', '.join(valid_types)}")
        return value

    def validate_project_frequency(self, value):
        valid_frequencies = ['one-time', 'weekly', 'monthly', 'quarterly', 'annually']
        if value not in valid_frequencies:
            raise serializers.ValidationError(f"Project frequency must be one of: {', '.join(valid_frequencies)}")
        return value

    def validate_payment_timing(self, value):
        valid_timings = ['upfront', 'milestone-based', 'upon-completion', 'monthly']
        if value not in valid_timings:
            raise serializers.ValidationError(f"Payment timing must be one of: {', '.join(valid_timings)}")
        return value

    def validate_working_hours(self, value):
        valid_options = ['business-hours', 'flexible', '24-7', 'overlap']
        if value and value not in valid_options:
            raise serializers.ValidationError(
                f"Working hours must be one of: {', '.join(valid_options)}"
        )
        return value

    def validate_budget_range(self, value):
        if value and not isinstance(value, str):
            raise serializers.ValidationError("Budget range must be a string.")
        return value

    def validate_project_budget(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Project budget must be positive.")
        return value

    def validate_industry(self, value):
        if value not in ALLOWED_INDUSTRIES:
            raise serializers.ValidationError(f"Industry must be one of: {', '.join(ALLOWED_INDUSTRIES)}")
        return value

    def validate_company_size(self, value):
        if value not in ALLOWED_COMPANY_SIZES:
            raise serializers.ValidationError(f"Company size must be one of: {', '.join(ALLOWED_COMPANY_SIZES)}")
        return value



    class Meta:
        model = ClientProfile
        fields = [
            'id',
            'user',
            'account_type',
            'first_name',
            'last_name',
            'company_name',
            'profile_picture',
            'company_description',
            'location',
            'industry',
            'company_size',
            'website',
            'project_types',
            'budget_range',
            'project_frequency',
            'preferred_communications',
            'working_hours',
            'business_goals',
            'current_challenges',
            'previous_experiences',
            'expected_timeline',
            'quality_importance',
            'payment_method',
            'monthly_budget',
            'project_budget',
            'payment_timing',
            'verification',
            'created_at',
            'updated_at',
        ]

        read_only_fields = ['created_at', 'updated_at']


    @transaction.atomic
    def create(self, validated_data):
        verification_data = validated_data.pop('verification', None)
        profile = ClientProfile.objects.create(**validated_data)
        if verification_data:
            verification = Verification.objects.create(**verification_data)
            profile.verification = verification
            profile.save()
        return profile

    @transaction.atomic
    def update(self, instance, validated_data):
        verification_data = validated_data.pop('verification', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if verification_data:
            if instance.verification:
                VerificationSerializer().update(instance.verification, verification_data)
            else:
                verification = Verification.objects.create(**verification_data)
                instance.verification = verification
                instance.save()
        return instance
