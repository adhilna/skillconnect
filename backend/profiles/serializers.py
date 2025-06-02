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
    verification = VerificationSerializer(read_only=True)  # ✅ Fixed typo

    class Meta:
        model = ClientProfile
        fields = '__all__'
