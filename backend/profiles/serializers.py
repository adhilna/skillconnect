from rest_framework import serializers
from django.conf import settings
from django.db import transaction
from .models import (
    FreelancerProfile, SocialLinks, Verification,
    Education, Experience, Language, Portfolio,
    Skill, ClientProfile
)
from .constants import ALLOWED_INDUSTRIES, ALLOWED_COMPANY_SIZES
from core.validators import (
    validate_non_empty_string,
    validate_optional_date_range,
    validate_country as country_validator,
    validate_location as location_validator,
    validate_age as age_validator,
    validate_skills_input as skills_validator,
    validate_url_field
)


# Supporting serializers
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class EducationSerializer(serializers.ModelSerializer):
    certificate = serializers.SerializerMethodField(required=False, allow_null=True)
    class Meta:
        model = Education
        fields = [
            'id', 'college', 'degree', 'start_year', 'end_year', 'certificate'
        ]
        extra_kwargs = {
            'college': {'required': False, 'allow_null': True},
            'degree': {'required': False, 'allow_null': True},
            'start_year': {'required': False, 'allow_null': True},
            'end_year': {'required': False, 'allow_null': True},
        }

    def get_certificate(self, obj):
        request = self.context.get('request')
        if obj.certificate and hasattr(obj.certificate, 'url'):
            return request.build_absolute_uri(obj.certificate.url) if request else obj.certificate.url
        return None

    def validate_college(self, value):
        return validate_non_empty_string(value, field_name="college")

    def validate_degree(self, value):
        return validate_non_empty_string(value, field_name="degree")

    # ✅ Combined year validation
    def validate(self, attrs):
        start_year = attrs.get("start_year")
        end_year = attrs.get("end_year")

        if start_year is None and end_year is None:
            return attrs  # Both are optional

        if start_year is None:
            raise serializers.ValidationError({"start_year": "Start year is required if end year is provided."})
        if end_year is None:
            raise serializers.ValidationError({"end_year": "End year is required if start year is provided."})

        if start_year > end_year:
            raise serializers.ValidationError({"end_year": "End year cannot be earlier than start year."})

        return attrs

class ExperienceSerializer(serializers.ModelSerializer):
    certificate = serializers.SerializerMethodField(required=False, allow_null=True)
    class Meta:
        model = Experience
        fields = [
            'id', 'role', 'company', 'start_date', 'end_date',
            'description', 'ongoing', 'certificate'
        ]
        extra_kwargs = {
            'role': {'required': False, 'allow_null': True},
            'company': {'required': False, 'allow_null': True},
            'start_date': {'required': False, 'allow_null': True},
            'end_date': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True},
            'ongoing': {'required': False, 'allow_null': True},
        }

    def get_certificate(self, obj):
        request = self.context.get('request')
        if obj.certificate and hasattr(obj.certificate, 'url'):
            return request.build_absolute_uri(obj.certificate.url) if request else obj.certificate.url
        return None

    def validate_role(self, value):
        return validate_non_empty_string(value, field_name="role")

    def validate_company(self, value):
        return validate_non_empty_string(value, field_name="company")

    def validate_description(self, value):
        return validate_non_empty_string(value, field_name="description", allow_special=True)

    # ✅ Combined date validation
    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        ongoing = attrs.get("ongoing", False)

        validate_optional_date_range(start_date, end_date, ongoing)
        return attrs

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'proficiency']
        extra_kwargs = {
            'name': {'required': False, 'allow_null': True},
            'proficiency': {'required': False, 'allow_null': True},
        }

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Language is required.")
        # Optional: enforce allowed language choices
        allowed_languages = ['english', 'malayalam', 'spanish', 'french', 'german', 'chinese', 'hindi']
        if value.lower() not in allowed_languages:
            raise serializers.ValidationError("Invalid language selected.")
        return value.lower()

    def validate_proficiency(self, value):
        if not value:
            raise serializers.ValidationError("Proficiency level is required.")
        allowed_levels = ['beginner', 'intermediate', 'advanced', 'native']
        if value.lower() not in allowed_levels:
            raise serializers.ValidationError("Invalid proficiency level.")
        return value.lower()

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'project_link']
        extra_kwargs = {
            'title': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True},
            'project_link': {'required': False, 'allow_null': True},
        }

    def validate_title(self, value):
        return validate_non_empty_string(value, field_name="Portfolio Title", min_len=1, max_len=200)

    def validate_description(self, value):
        return validate_non_empty_string(value, field_name="Portfolio Description", min_len=1, max_len=1000)

    def validate_project_link(self, value):
        return validate_url_field(value, field_name="Project Link") 

class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = [
            'github_url', 'linkedin_url', 'twitter_url',
            'facebook_url', 'instagram_url'
        ]
        extra_kwargs = {
            'github_url': {'required': False, 'allow_null': True},
            'linkedin_url': {'required': False, 'allow_null': True},
            'twitter_url': {'required': False, 'allow_null': True},
            'facebook_url': {'required': False, 'allow_null': True},
            'instagram_url': {'required': False, 'allow_null': True},
        }

    def validate_github_url(self, value):
        return validate_url_field(value, "GitHub URL")

    def validate_linkedin_url(self, value):
        return validate_url_field(value, "LinkedIn URL")

    def validate_twitter_url(self, value):
        return validate_url_field(value, "Twitter URL")

    def validate_facebook_url(self, value):
        return validate_url_field(value, "Facebook URL")

    def validate_instagram_url(self, value):
        return validate_url_field(value, "Instagram URL")

class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            'email_verified', 'phone_verified',
            'id_verified', 'video_verified'
        ]
        extra_kwargs = {
            'email_verified': {'required': False, 'allow_null': True},
            'phone_verified': {'required': False, 'allow_null': True},
            'id_verified': {'required': False, 'allow_null': True},
            'video_verified': {'required': False, 'allow_null': True},
        }

# Main nested profile serializer
class FreelancerProfileSetupSerializer(serializers.ModelSerializer):
    skills_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    educations_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    experiences_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    languages_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    portfolios_input = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    social_links_input = SocialLinksSerializer(required=False, write_only=True)
    verification_input = VerificationSerializer(required=False, write_only=True)
    skills_output = SkillSerializer(source='skills', many=True, read_only=True, required=False)
    educations_output = EducationSerializer(source='educations', many=True, read_only=True, required=False)
    experiences_output = ExperienceSerializer(source='experiences', many=True, read_only=True, required=False)
    languages_output = LanguageSerializer(source='languages', many=True, read_only=True, required=False)
    portfolios_output = PortfolioSerializer(source='portfolios', many=True, read_only=True, required=False)
    social_links_output = SocialLinksSerializer(source='user.social_links', read_only=True)
    verification_output = VerificationSerializer(source='user.verification', read_only=True)

    class Meta:
        model = FreelancerProfile
        fields = [
            'id', 'user', 'profile_picture', 'about', 'age', 'country',
            'first_name', 'last_name', 'location', 'skills_input', 'is_available',
            'created_at', 'updated_at', 'skills_output', 'educations_output',
            'educations_input', 'experiences_input', 'social_links_output', 'verification_output',
            'languages_input', 'portfolios_input', 'experiences_output', 'languages_output',
            'portfolios_output', 'social_links_input', 'verification_input',
        ]

        extra_kwargs = {
            'user': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    @transaction.atomic
    def create(self, validated_data):
        print("==== [DEBUG] SERIALIZER CREATE CALLED ====")
        print("Initial validated_data:", validated_data)

        skills_data = validated_data.pop('skills_input', [])
        educations_data = validated_data.pop('educations_input', [])
        experiences_data = validated_data.pop('experiences_input', [])
        languages_data = validated_data.pop('languages_input', [])
        portfolios_data = validated_data.pop('portfolios_input', [])
        social_links_data = validated_data.pop('social_links_input', {})
        verification_data = validated_data.pop('verification_input', {})

        user = self.context['request'].user
        print("User:", user)
        if not user:
            raise serializers.ValidationError("User not found in request context")

        # Prevent duplicate profiles
        if FreelancerProfile.objects.filter(user=user).exists():
            raise serializers.ValidationError("Profile already exists for this user")

        validated_data.pop('user', None)
        profile = FreelancerProfile.objects.create(user=user, **validated_data)
        print("Created profile:", profile)

        # Handle Skills (ManyToMany)
        print("Skills data right before creation:", skills_data)
        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                try:
                    skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                    profile.skills.add(skill_obj)
                    print("Added skill:", skill_obj)
                except Exception as e:
                    print("Failed to add skill:", e)

        # Handle Educations (FK)
        print("Educations data right before creation:", educations_data)
        for idx, edu in enumerate(educations_data):
            print("Creating education with:", edu)
            try:
                certificate_file_list = self.context['request'].FILES.getlist(f'education_certificate_{idx}')
                certificate_file = certificate_file_list[0] if certificate_file_list else None

                if certificate_file is None:
                    print(f"[WARN] No certificate file found for education_certificate_{idx}")
                edu_obj = Education.objects.create(profile=profile, **edu)
                if certificate_file:
                    edu_obj.certificate.save(certificate_file.name, certificate_file)
                print("Created education:", edu_obj)
            except Exception as e:
                print("Failed to create education:", e)


        # Handle Experiences (FK)
        print("Experiences data right before creation:", experiences_data)
        for idx, exp in enumerate(experiences_data):
            print("Creating experience with:", exp)
            try:
                certificate_file_list = self.context['request'].FILES.getlist(f'experience_certificate_{idx}')
                certificate_file = certificate_file_list[0] if certificate_file_list else None

                if certificate_file is None:
                    print(f"[WARN] No certificate file found for experience_certificate_{idx}")
                exp_obj = Experience.objects.create(profile=profile, **exp)
                if certificate_file:
                    exp_obj.certificate.save(certificate_file.name, certificate_file)
                print("Created experience:", exp_obj)
            except Exception as e:
                print("Failed to create experience:", e)


        # Handle Languages (FK)
        print("Languages data right before creation:", languages_data)
        for lang in languages_data:
            print("Creating language with:", lang)
            try:
                lang_obj = Language.objects.create(profile=profile, **lang)
                print("Created language:", lang_obj)
            except Exception as e:
                print("Failed to create language:", e)

        # Handle Portfolios (FK)
        print("Portfolios data right before creation:", portfolios_data)
        for port in portfolios_data:
            print("Creating portfolio with:", port)
            try:
                port_obj = Portfolio.objects.create(profile=profile, **port)
                print("Created portfolio:", port_obj)
            except Exception as e:
                print("Failed to create portfolio:", e)

        # Handle SocialLinks (OneToOne to User)
        print("SocialLinks data right before creation:", social_links_data)
        if social_links_data:
            try:
                sl_obj, _ = SocialLinks.objects.update_or_create(user=user, defaults=social_links_data)
                print("Updated/created social links:", sl_obj)
            except Exception as e:
                print("Failed to create social links:", e)

        # Handle Verification (OneToOne to User)
        print("Verification data right before creation:", verification_data)
        if verification_data:
            try:
                v_obj, _ = Verification.objects.update_or_create(user=user, defaults=verification_data)
                print("Updated/created verification:", v_obj)
            except Exception as e:
                print("Failed to create verification:", e)

        print("Final profile object:", profile)
        return profile

    @transaction.atomic
    def update(self, instance, validated_data):
        print("==== [DEBUG] SERIALIZER UPDATE CALLED ====")
        print("Initial validated_data:", validated_data)

        skills_data = validated_data.pop('skills_input', [])
        educations_data = validated_data.pop('educations_input', [])
        experiences_data = validated_data.pop('experiences_input', [])
        languages_data = validated_data.pop('languages_input', [])
        portfolios_data = validated_data.pop('portfolios_input', [])
        social_links_data = validated_data.pop('social_links_input', {})
        verification_data = validated_data.pop('verification_input', {})

        # Update direct fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        print("Updated profile:", instance)

        # Update Skills
        instance.skills.clear()
        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                instance.skills.add(skill_obj)

        # Update Educations
        existing_edu_ids = set(instance.educations.values_list('id', flat=True))
        new_edu_ids = set()
        for idx, edu in enumerate(educations_data):
            edu_id = edu.get('id')
            certificate_file = self.context['request'].FILES.get(f'education_certificate_{idx}')
            if edu_id and instance.educations.filter(id=edu_id).exists():
                edu_obj = instance.educations.get(id=edu_id)
                for attr, value in edu.items():
                    setattr(edu_obj, attr, value)
                if certificate_file:
                    edu_obj.certificate.save(certificate_file.name, certificate_file)
                edu_obj.save()
                new_edu_ids.add(edu_id)
            else:
                edu_obj = Education.objects.create(profile=instance, **edu)
                if certificate_file:
                    edu_obj.certificate.save(certificate_file.name, certificate_file)
                new_edu_ids.add(edu_obj.id)

        # Delete removed educations
        to_delete_edu_ids = existing_edu_ids - new_edu_ids
        instance.educations.filter(id__in=to_delete_edu_ids).delete()

        # Update Experiences
        existing_exp_ids = set(instance.experiences.values_list('id', flat=True))
        new_exp_ids = set()
        for idx, exp in enumerate(experiences_data):
            exp_id = exp.get('id')
            certificate_file = self.context['request'].FILES.get(f'experience_certificate_{idx}')
            if exp_id and instance.experiences.filter(id=exp_id).exists():
                exp_obj = instance.experiences.get(id=exp_id)
                for attr, value in exp.items():
                    setattr(exp_obj, attr, value)
                if certificate_file:
                    exp_obj.certificate.save(certificate_file.name, certificate_file)
                exp_obj.save()
                new_exp_ids.add(exp_id)
            else:
                exp_obj = Experience.objects.create(profile=instance, **exp)
                if certificate_file:
                    exp_obj.certificate.save(certificate_file.name, certificate_file)
                new_exp_ids.add(exp_obj.id)

        # Delete removed experiences
        to_delete_exp_ids = existing_exp_ids - new_exp_ids
        instance.experiences.filter(id__in=to_delete_exp_ids).delete()

        # Update Languages
        instance.languages.all().delete()
        for lang in languages_data:
            Language.objects.create(profile=instance, **lang)

        # Update Portfolios
        instance.portfolios.all().delete()
        for port in portfolios_data:
            Portfolio.objects.create(profile=instance, **port)

        # Update SocialLinks
        if social_links_data:
            SocialLinks.objects.update_or_create(user=instance.user, defaults=social_links_data)

        # Update Verification
        if verification_data:
            Verification.objects.update_or_create(user=instance.user, defaults=verification_data)

        print("Final profile object:", instance)
        return instance

    def validate_first_name(self, value):
        return validate_non_empty_string(value, field_name="first name", min_len=2)

    def validate_last_name(self, value):
        return validate_non_empty_string(value, field_name="last name", min_len=2)

    def validate_country(self, value):
        return country_validator(value)

    def validate_location(self, value):
        return location_validator(value)

    def validate_age(self, value):
        return age_validator(value)

    def validate_about(self, value):
        return validate_non_empty_string(value, field_name="about", min_len=10, max_len=2000, allow_special=True)

    def validate_skills_input(self, value):
        return skills_validator(self, value)

    def validate_languages_input(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one language must be added.")
        return value

    def validate_portfolios_input(self, value):
        for i, portfolio_data in enumerate(value):
            serializer = PortfolioSerializer(data=portfolio_data)
            serializer.is_valid(raise_exception=True)  # will raise ValidationError if invalid
        return value

    def validate_social_links_input(self, value):
        """
        Validate social links and ensure at least one is provided.
        """
        serializer = SocialLinksSerializer(data=value)
        serializer.is_valid(raise_exception=True)

        # Require at least one non-empty link
        if not any(value.get(field) for field in [
            'github_url', 'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url'
        ]):
            raise serializers.ValidationError(
                {"social_links_input": "At least one social link must be provided."}
            )

        return value

class ClientProfileSetupSerializer(serializers.ModelSerializer):

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
            'country',
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
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """Customize output if needed (e.g., format image URL, etc.)"""
        rep = super().to_representation(instance)
        # rep['profile_picture_url'] = instance.profile_picture.url if instance.profile_picture else None
        return rep

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        if not user:
            raise serializers.ValidationError("User not found in request context")

        # Prevent duplicate profiles
        if ClientProfile.objects.filter(user=user).exists():
            raise serializers.ValidationError("Profile already exists for this user")

        validated_data.pop('user', None)
        profile = ClientProfile.objects.create(user=user, **validated_data)
        return profile

    @transaction.atomic
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def validate(self, attrs):
        account_type = attrs.get('account_type')
        if account_type == 'business':
            if not attrs.get('company_name'):
                raise serializers.ValidationError({'company_name': 'Company name is required for business accounts.'})
        # Add more conditional validation as needed
        return attrs

class FreelancerPublicMinimalSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True, default=list)
    name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = [
            'id',
            'name',
            'title',             # Computed from experiences
            'location',
            'rating',            # Placeholder for now
            'review_count',      # Placeholder for now
            'is_available',
            'skills',
            'profile_picture',   # Optional: used for avatars
            'about',             # Description snippet
        ]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.user.username

    def get_title(self, obj):
        experience = obj.experiences.order_by('-start_date').first()
        return experience.role if experience else "Freelancer"

    def get_rating(self, obj):
        # Replace with actual rating calculation if available
        return 0

    def get_review_count(self, obj):
        # Replace with actual review count if available
        return 0

class FreelancerPublicDetailSerializer(FreelancerPublicMinimalSerializer):
    educations_output = EducationSerializer(many=True, read_only=True, source='educations')
    experiences_output = ExperienceSerializer(many=True, read_only=True, source='experiences')
    languages_output = LanguageSerializer(many=True, read_only=True, source='languages')
    portfolios_output = PortfolioSerializer(many=True, read_only=True, source='portfolios')
    social_links_output = SocialLinksSerializer(source='user.social_links', read_only=True)
    verification_output = VerificationSerializer(source='user.verification', read_only=True)

    class Meta(FreelancerPublicMinimalSerializer.Meta):
        fields = FreelancerPublicMinimalSerializer.Meta.fields + [
            'age',
            'country',
            'educations_output',
            'experiences_output',
            'languages_output',
            'portfolios_output',
            'social_links_output',
            'verification_output',
            'created_at',
            'updated_at',
        ]

class ClientPublicMinimalSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = [
            'id',
            'name',
            'account_type',
            'company_name',
            'profile_picture',
            'company_description',
            'country',
            'location',
            'industry',
        ]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.user.username

class ClientPublicDetailSerializer(ClientPublicMinimalSerializer):
    class Meta(ClientPublicMinimalSerializer.Meta):
        fields = ClientPublicMinimalSerializer.Meta.fields + [
            'website',
            'company_size',
            'project_types',
            'budget_range',
            'project_frequency',
            'business_goals',
            'current_challenges',
            'working_hours',
            'preferred_communications',
            'payment_method',
            'payment_timing',
        ]
