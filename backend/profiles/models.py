from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL

# -----------------------------------
# SHARED MODELS
# -----------------------------------

class SocialLinks(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='social_links')
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Social Links for {self.user.username}"

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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='freelancer_profile')
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    profile_picture = models.ImageField(upload_to='freelancers/profile_pics', blank=True, null=True)
    about = models.TextField(blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255)
    skills = models.ManyToManyField(Skill, blank=True, related_name='freelancers')
    verification = models.OneToOneField(Verification, on_delete=models.SET_NULL, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.first_name

class Education(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='educations')
    college = models.CharField(max_length=128)
    degree = models.CharField(max_length=128)
    year = models.PositiveIntegerField()
    certificate = models.FileField(upload_to='freelancers/certifications/education_certificates', blank=True, null=True)

    def __str__(self):
        return f"{self.degree} at {self.college}"

class Experience(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='experiences')
    role = models.CharField(max_length=128)
    company = models.CharField(max_length=128)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    certificate = models.FileField(upload_to='freelancers/certifications/experience_certificates', blank=True, null=True)

    def __str__(self):
        return f"{self.role} at {self.company}"

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
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='portfolios')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    project_link = models.URLField(blank=True, null=True)

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
