from rest_framework import serializers
from django.db import transaction
from .models import (
    FreelancerProfile, ClientProfile, Skill, Verification, Education,
    Experience, Language, Portfolio, SocialLinks
)

# ----------------------------
# SHARED / RELATED SERIALIZERS
# ----------------------------

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = ['id', 'email_verified', 'phone_verified', 'id_verified', 'video_verified']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'college', 'degree', 'year', 'certificate']

class ExperienceSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Experience
        fields = [
            'id', 'profile', 'role', 'company', 'start_date', 'end_date',
            'description', 'certificate'
        ]

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
    skills = SkillSerializer(many=True)
    educations = EducationSerializer(many=True)
    experiences = ExperienceSerializer(many=True)
    languages = LanguageSerializer(many=True)
    portfolios = PortfolioSerializer(many=True)
    verifications = VerificationSerializer(read_only=True)
    social_links = SocialLinksSerializer(read_only=True)

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

    ALLOWED_INDUSTRIES = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Real Estate',
        'Marketing & Advertising', 'Manufacturing', 'Food & Beverage', 'Fashion',
        'Travel & Tourism', 'Non-profit', 'Entertainment', 'Consulting', 'Other'
    ]

    ALLOWED_COMPANY_SIZES = [
        'Just me (1)', 'Small team (2-10)', 'Growing business (11-50)',
        'Medium company (51-200)', 'Large enterprise (200+)'
    ]

    @transaction.atomic
    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        languages_data = validated_data.pop('languages', [])
        portfolios_data = validated_data.pop('portfolios', [])
        social_links_data = validated_data.pop('social_links', None)

        profile = FreelancerProfile.objects.create(**validated_data)

        for skill in skills_data:
            skill_obj, _ = Skill.objects.get_or_create(**skill)
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

        if social_links_data:
            SocialLinks.objects.create(profile=profile, **social_links_data)

        return profile

    @transaction.atomic
    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills', [])
        educations_data = validated_data.pop('educations', [])
        experiences_data = validated_data.pop('experiences', [])
        languages_data = validated_data.pop('languages', [])
        portfolios_data = validated_data.pop('portfolios', [])
        social_links_data = validated_data.pop('social_links', {})

        # Update direct fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update ManyToMany: Skills
        instance.skills.clear()
        for skill in skills_data:
            skill_obj, _ = Skill.objects.get_or_create(**skill)
            instance.skills.add(skill_obj)

        # Update FK: Educations
        instance.educations.all().delete()
        for edu in educations_data:
            Education.objects.create(profile=instance, **edu)

        # Update FK: Experiences
        instance.experiences.all().delete()
        for exp in experiences_data:
            Experience.objects.create(profile=instance, **exp)

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
        if value and not value.isdigit():
            raise serializers.ValidationError("Working hours must be a number.")
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
        if value not in ClientProfileSerializer.ALLOWED_INDUSTRIES:
            raise serializers.ValidationError(
                f"Industry must be one of: {', '.join(ClientProfileSerializer.ALLOWED_INDUSTRIES)}"
            )
        return value

    def validate_company_size(self, value):
        if value not in ClientProfileSerializer.ALLOWED_COMPANY_SIZES:
            raise serializers.ValidationError(
                f"Company size must be one of: {', '.join(ClientProfileSerializer.ALLOWED_COMPANY_SIZES)}"
            )
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
            Verification.objects.update_or_create(profile=instance, defaults=verification_data)
        return instance
