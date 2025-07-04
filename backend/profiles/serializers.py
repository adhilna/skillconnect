from rest_framework import serializers
from django.db import transaction
from .models import (
    FreelancerProfile, SocialLinks, Verification,
    Education, Experience, Language, Portfolio,
    Skill, ClientProfile
)
from .constants import ALLOWED_INDUSTRIES, ALLOWED_COMPANY_SIZES

# Supporting serializers
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class EducationSerializer(serializers.ModelSerializer):
    certificate = serializers.FileField(required=False, allow_null=True)
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


class ExperienceSerializer(serializers.ModelSerializer):
    certificate = serializers.FileField(required=False, allow_null=True)
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


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'proficiency']
        extra_kwargs = {
            'name': {'required': False, 'allow_null': True},
            'proficiency': {'required': False, 'allow_null': True},
        }


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'project_link']
        extra_kwargs = {
            'title': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True},
            'project_link': {'required': False, 'allow_null': True},
        }


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
    social_links_output = SocialLinksSerializer(source='user.sociallinks', read_only=True)
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

    # Update Skills (ManyToMany)
        print("Skills data right before update:", skills_data)
        instance.skills.clear()
        for skill in skills_data:
            name = skill.get('name')
            if name and name.strip():
                try:
                    skill_obj, _ = Skill.objects.get_or_create(name=name.strip())
                    instance.skills.add(skill_obj)
                    print("Added skill:", skill_obj)
                except Exception as e:
                    print("Failed to add skill:", e)


        # Update Educations (FK)
        print("Educations data right before update:", educations_data)
        instance.educations.all().delete()
        for edu in educations_data:
            print("Creating education with:", edu)
            try:
                certificate_file = edu.pop('certificate', None)
                edu_obj = Education.objects.create(profile=instance, **edu)
                if certificate_file:
                    edu_obj.certificate.save(certificate_file.name, certificate_file)
                print("Created education:", edu_obj)
            except Exception as e:
                print("Failed to create education:", e)

        # Update Experiences (FK)
        print("Experiences data right before update:", experiences_data)
        instance.experiences.all().delete()
        for exp in experiences_data:
            print("Creating experience with:", exp)
            try:
                certificate_file = exp.pop('certificate', None)
                exp_obj = Experience.objects.create(profile=instance, **exp)
                if certificate_file:
                    exp_obj.certificate.save(certificate_file.name, certificate_file)
                print("Created experience:", exp_obj)
            except Exception as e:
                print("Failed to create experience:", e)

        # Update Languages (FK)
        print("Languages data right before update:", languages_data)
        instance.languages.all().delete()
        for lang in languages_data:
            print("Creating language with:", lang)
            try:
                lang_obj = Language.objects.create(profile=instance, **lang)
                print("Created language:", lang_obj)
            except Exception as e:
                print("Failed to create language:", e)

        # Update Portfolios (FK)
        print("Portfolios data right before update:", portfolios_data)
        instance.portfolios.all().delete()
        for port in portfolios_data:
            print("Creating portfolio with:", port)
            try:
                port_obj = Portfolio.objects.create(profile=instance, **port)
                print("Created portfolio:", port_obj)
            except Exception as e:
                print("Failed to create portfolio:", e)

        # Update SocialLinks (OneToOne to User)
        print("SocialLinks data right before update:", social_links_data)
        if social_links_data:
            try:
                sl_obj, _ = SocialLinks.objects.update_or_create(user=instance.user, defaults=social_links_data)
                print("Updated/created social links:", sl_obj)
            except Exception as e:
                print("Failed to update social links:", e)

        # Update Verification (OneToOne to User)
        print("Verification data right before update:", verification_data)
        if verification_data:
            try:
                v_obj, _ = Verification.objects.update_or_create(user=instance.user, defaults=verification_data)
                print("Updated/created verification:", v_obj)
            except Exception as e:
                print("Failed to update verification:", e)

        print("Final profile object:", instance)
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














# from rest_framework import serializers
# from django.db import transaction
# from .models import (
#     FreelancerProfile, ClientProfile, Verification, Education,
#     Experience, Language, Portfolio, SocialLinks
# )
# from core.models import Skill
# from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
# from django.core.validators import URLValidator
# from rest_framework.exceptions import ValidationError
# import re
# from .constants import ALLOWED_INDUSTRIES, ALLOWED_COMPANY_SIZES


# class SkillSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Skill
#         fields = ['id', 'name']

# class VerificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Verification
#         fields = ['id', 'email_verified', 'phone_verified', 'id_verified', 'video_verified']

# class EducationSerializer(serializers.ModelSerializer):
#     certificate = serializers.FileField(required=False, allow_null=True)

#     class Meta:
#         model = Education
#         fields = ['id', 'college', 'degree', 'start_year', 'end_year', 'certificate']

#     def to_internal_value(self, data):
#         print(f"Education data: {data}")
#         certificate = data.get('certificate')
#         print(f"Education certificate: {certificate} ({type(certificate)})")
#         if isinstance(certificate, (InMemoryUploadedFile, TemporaryUploadedFile)):
#             data['certificate'] = certificate
#         elif certificate is None or certificate == '':
#             data['certificate'] = None
#         elif isinstance(certificate, str):
#             data['certificate'] = certificate
#         else:
#             raise serializers.ValidationError({"certificate": f"Invalid certificate value: {certificate}"})
#         return super().to_internal_value(data)

# class ExperienceSerializer(serializers.ModelSerializer):
#     certificate = serializers.FileField(required=False, allow_null=True)

#     class Meta:
#         model = Experience
#         fields = ['id', 'company', 'role', 'start_date', 'end_date', 'ongoing', 'description', 'certificate']

#     def to_internal_value(self, data):
#         print(f"Experience data: {data}")
#         certificate = data.get('certificate')
#         print(f"Experience certificate: {certificate} ({type(certificate)})")
#         if isinstance(certificate, (InMemoryUploadedFile, TemporaryUploadedFile)):
#             data['certificate'] = certificate
#         elif certificate is None or certificate == '':
#             data['certificate'] = None
#         elif isinstance(certificate, str):
#             data['certificate'] = certificate
#         else:
#             raise serializers.ValidationError({"certificate": f"Invalid certificate value: {certificate}"})
#         return super().to_internal_value(data)

# class LanguageSerializer(serializers.ModelSerializer):
#     profile = serializers.PrimaryKeyRelatedField(read_only=True)
#     class Meta:
#         model = Language
#         fields = ['id', 'profile', 'name', 'proficiency']

# class PortfolioSerializer(serializers.ModelSerializer):
#     profile = serializers.PrimaryKeyRelatedField(read_only=True)
#     class Meta:
#         model = Portfolio
#         fields = [
#             'id', 'profile', 'title', 'description', 'project_link'
#         ]

# class SocialLinksSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SocialLinks
#         fields = ['github_url', 'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url']

# # ----------------------------
# # MAIN PROFILE SERIALIZERS
# # ----------------------------

# class FreelancerProfileSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(read_only=True)
#     skills = serializers.ListField(
#         child=serializers.CharField(),  # Accept list of skill names
#         write_only=True
#     )
#     educations = EducationSerializer(many=True, required=False)
#     experiences = ExperienceSerializer(many=True, required=False)
#     languages = LanguageSerializer(many=True)
#     portfolios = PortfolioSerializer(many=True)
#     verifications = VerificationSerializer(required=False)
#     social_links = SocialLinksSerializer()

#     import re

#     def validate_first_name(self, value):
#         if not value:
#             raise serializers.ValidationError("First name is required.")
#         # Clean up: replace multiple spaces with one, trim
#         value = re.sub(r'\s+', ' ', value).strip()
#         if not re.fullmatch(r'^[A-Za-zÀ-ÿ\'\- ]+$', value):
#             raise serializers.ValidationError("First name must contain only letters, spaces, hyphens, or apostrophes.")
#         # Optionally, check if the cleaned name is too short or just spaces
#         if not value:
#             raise serializers.ValidationError("First name cannot be just spaces.")
#         return value

#     def validate_last_name(self, value):
#         if not value:
#             raise serializers.ValidationError("Last name is required.")
#         value = re.sub(r'\s+', ' ', value).strip()
#         if not re.fullmatch(r'^[A-Za-zÀ-ÿ\'\- ]+$', value):
#             raise serializers.ValidationError("Last name must contain only letters, spaces, hyphens, or apostrophes.")
#         if not value:
#             raise serializers.ValidationError("Last name cannot be just spaces.")
#         return value


#     def validate_age(self, value):
#         if value is not None and (value < 18 or value > 120):
#             raise serializers.ValidationError("Age must be between 18 and 120.")
#         return value

#     def validate_social_links(self, value):
#         validator = URLValidator()
#         for field in ['github_url', 'linkedin_url']:
#             url = value.get(field)
#             if url:
#                 try:
#                     validator(url)
#                 except ValidationError:
#                     raise serializers.ValidationError({field: 'Invalid URL'})
#         return value

#     class Meta:
#         model = FreelancerProfile
#         fields = [
#             'id',
#             'user',
#             'first_name',
#             'last_name',
#             'profile_picture',
#             'about',
#             'age',
#             'country',
#             'location',
#             'skills',
#             'verifications',
#             'is_available',
#             'created_at',
#             'updated_at',
#             'educations',
#             'experiences',
#             'languages',
#             'portfolios',
#             'social_links',
#         ]

#     @transaction.atomic
#     def create(self, validated_data):
#         skills_data = validated_data.pop('skills', [])
#         educations_data = validated_data.pop('educations', [])
#         experiences_data = validated_data.pop('experiences', [])
#         languages_data = validated_data.pop('languages', [])
#         portfolios_data = validated_data.pop('portfolios', [])
#         social_links_data = validated_data.pop('social_links', {})
#         verifications_data = validated_data.pop('verifications', None)

#         user = self.context['request'].user
#         if not user:
#             raise serializers.ValidationError("User not found in request context")

#         # SAFETY: Prevent duplicate profiles
#         if FreelancerProfile.objects.filter(user=user).exists():
#             raise serializers.ValidationError("Profile already exists for this user")

#         profile = FreelancerProfile.objects.create( **validated_data)

#         SocialLinks.objects.update_or_create(user=user, **social_links_data)

#         for skill in skills_data:
#             skill_obj, _ = Skill.objects.get_or_create(name=skill.strip())
#             profile.skills.add(skill_obj)

#         # FK: Educations
#         for edu in educations_data:
#             certificate_file = edu.pop('certificate', None)
#             edu_obj = Education.objects.create(profile=profile, **edu)
#             if certificate_file:
#                 edu_obj.certificate.save(certificate_file.name, certificate_file)

#         # FK: Experiences
#         for exp in experiences_data:
#             certificate_file = exp.pop('certificate', None)
#             exp_obj = Experience.objects.create(profile=profile, **exp)
#             if certificate_file:
#                 exp_obj.certificate.save(certificate_file.name, certificate_file)

#         # FK: Languages
#         for lang in languages_data:
#             Language.objects.create(profile=profile, **lang)

#         # FK: Portfolios
#         for port in portfolios_data:
#             Portfolio.objects.create(profile=profile, **port)

#         if verifications_data:
#             Verification.objects.update_or_create(
#                 user=user,
#                 defaults=verifications_data
#             )

#         return profile

#     @transaction.atomic
#     def update(self, instance, validated_data):
#         skills_data = validated_data.pop('skills', [])
#         educations_data = validated_data.pop('educations', [])
#         experiences_data = validated_data.pop('experiences', [])
#         languages_data = validated_data.pop('languages', [])
#         portfolios_data = validated_data.pop('portfolios', [])
#         social_links_data = validated_data.pop('social_links', {})
#         verifications_data = validated_data.pop('verifications', None)


#         # Update direct fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         # Update ManyToMany: Skills
#         instance.skills.clear()
#         for skill in skills_data:
#             skill_obj, _ = Skill.objects.get_or_create(name=skill.strip())
#             instance.skills.add(skill_obj)

#         # Update educations
#         instance.educations.all().delete()
#         for edu_data in educations_data:
#             Education.objects.create(profile=instance, **edu_data)

#         # Update experiences
#         instance.experiences.all().delete()
#         for exp_data in experiences_data:
#             Experience.objects.create(profile=instance, **exp_data)

#         # Update FK: Languages
#         instance.languages.all().delete()
#         for lang in languages_data:
#             Language.objects.create(profile=instance, **lang)

#         # Update FK: Portfolios
#         instance.portfolios.all().delete()
#         for port in portfolios_data:
#             Portfolio.objects.create(profile=instance, **port)

#         # Update or create SocialLinks (OneToOne)
#         if social_links_data:
#             SocialLinks.objects.update_or_create(profile=instance, defaults=social_links_data)

#         if verifications_data:
#             Verification.objects.update_or_create(
#                 user=instance.user,
#                 defaults=verifications_data
#             )

#         return instance

