from rest_framework import serializers
from .models import (
    FreelancerProfile, ClientProfile, Skill, Verification, Education,
    Experience, Certification, Language, Portfolio
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
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'

# ----------------------------
# MAIN PROFILE SERIALIZERS
# ----------------------------

class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)  # ✅ Fixed: many=True
    certifications = CertificationSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    portfolios = PortfolioSerializer(many=True, read_only=True)
    verification = VerificationSerializer(read_only=True)

    class Meta:
        model = FreelancerProfile
        fields = '__all__'

class ClientProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    verification = VerificationSerializer(read_only=True)  # ✅ Fixed typo

    class Meta:
        model = ClientProfile
        fields = '__all__'
