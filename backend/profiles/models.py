from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

# -----------------------------------
# SHARED MODELS
# -----------------------------------

class Verification(models.Model):
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    id_verified = models.BooleanField(default=False)
    video_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Verification (Email: {self.email_verified}, ID: {self.id_verified})"

# -----------------------------------
# FREELANCER PROFILE + RELATED
# -----------------------------------

class Skill(models.Model):
    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name

class FreelancerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=128)
    profile_picture = models.ImageField(upload_to='freelancers/profile_pics', blank=True, null=True)
    about = models.TextField(blank=True)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    linkedin_url = models.URLField(max_length=200, null=True, blank=True)
    github_url = models.URLField(max_length=200, null=True, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    verification = models.OneToOneField(Verification, on_delete=models.SET_NULL, null=True, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name

class Education(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='educations')
    college = models.CharField(max_length=128)
    degree = models.CharField(max_length=128)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.degree} at {self.college}"

class Experience(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='experiences')
    role = models.CharField(max_length=128)
    company = models.CharField(max_length=128)
    duration = models.CharField(max_length=128)
    description = models.TextField()

    def __str__(self):
        return f"{self.role} at {self.company}"

class Certification(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=128)
    organization = models.CharField(max_length=128)
    file = models.FileField(upload_to='freelancers/certifications', blank=True, null=True)

    def __str__(self):
        return self.title

class Language(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('fluent', 'Fluent'),
        ('native', 'Native'),
    ]
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='languages')
    name = models.CharField(max_length=128)
    proficiency = models.CharField(max_length=128, choices=PROFICIENCY_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"

class Portfolio(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='portfolios')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    link = models.URLField() 

    def __str__(self):
        return self.title

# -----------------------------------
# CLIENT PROFILE + RELATED
# -----------------------------------

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=128)
    profile_picture = models.ImageField(upload_to='clients/profile_pics/', blank=True, null=True)
    company_name = models.CharField(max_length=128, blank=True)
    about = models.TextField(blank=True)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    verification = models.OneToOneField(Verification, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.full_name


# 1) backend models: 

#  2 ) i need the current standard approach 

# serilaizers: from rest_framework import serializers from .models import ( FreelancerProfile, ClientProfile, Skill, Verification, Education, Experience, Certification, Language, Portfolio )

# # ---------------------------- # SHARED / RELATED SERIALIZERS # ----------------------------

# class SkillSerializer(serializers.ModelSerializer): class Meta: model = Skill fields = ['id', 'name']

# class VerificationSerializer(serializers.ModelSerializer): class Meta: model = Verification fields = 'all'

# class EducationSerializer(serializers.ModelSerializer): class Meta: model = Education fields = 'all'

# class ExperienceSerializer(serializers.ModelSerializer): class Meta: model = Experience fields = 'all'

# class CertificationSerializer(serializers.ModelSerializer): class Meta: model = Certification fields = 'all'

# class LanguageSerializer(serializers.ModelSerializer): class Meta: model = Language fields = 'all'

# class PortfolioSerializer(serializers.ModelSerializer): class Meta: model = Portfolio fields = 'all'

# # ---------------------------- # MAIN PROFILE SERIALIZERS # ----------------------------

# class FreelancerProfileSerializer(serializers.ModelSerializer): user = serializers.PrimaryKeyRelatedField(read_only=True) skills = SkillSerializer(many=True, read_only=True) educations = EducationSerializer(many=True, read_only=True) experiences = ExperienceSerializer(many=True, read_only=True) # ✅ Fixed: many=True certifications = CertificationSerializer(many=True, read_only=True) languages = LanguageSerializer(many=True, read_only=True) portfolios = PortfolioSerializer(many=True, read_only=True) verification = VerificationSerializer(read_only=True)

# class Meta: model = FreelancerProfile fields = 'all'

# class ClientProfileSerializer(serializers.ModelSerializer): user = serializers.PrimaryKeyRelatedField(read_only=True) verification = VerificationSerializer(read_only=True) # ✅ Fixed typo

# class Meta: model = ClientProfile fields = 'all'

# views: from rest_framework import viewsets from rest_framework.permissions import IsAuthenticated from .models import FreelancerProfile, ClientProfile from .serializers import FreelancerProfileSerializer, ClientProfileSerializer class FreelancerProfileViewset(viewsets.ModelViewSet): serializer_class = FreelancerProfileSerializer permission_classes = [IsAuthenticated] def get_queryset(self): return FreelancerProfile.objects.filter(user=self.request.user) def get_object(self): return FreelancerProfile.objects.get(user=self.request.user) def perform_create(self, serializer): serializer.save(user=self.request.user) class ClientProfileViewset(viewsets.ModelViewSet): serializer_class = ClientProfileSerializer permission_classes = [IsAuthenticated] def get_queryset(self): return ClientProfile.objects.filter(user = self.request.user) def get_object(self): return ClientProfile.objects.get(user = self.request.user) urls: from django.urls import path, include from rest_framework.routers import DefaultRouter from .views import FreelancerProfileViewset, ClientProfileViewset

# router = DefaultRouter() router.register(r'freelancer/profile', FreelancerProfileViewset, basename='freelancer-profile') router.register(r'client/profile', ClientProfileViewset, basename='client-profile')

# urlpatterns = [ path('', include(router.urls)), ]

# and i have already a have a kind of design