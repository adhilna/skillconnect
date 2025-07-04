from django.db import models
from django.conf import settings
from django.utils import timezone
from core.models import Skill
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator, MinValueValidator, MaxValueValidator
import os

User = settings.AUTH_USER_MODEL

# -----------------------------------
# UPLOAD PATH FUNCTIONS
# -----------------------------------

def freelancer_profile_picture_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    filename = f"{instance.user.id}_profile{ext}"
    return f"freelancers/profile_pics/{instance.user.id}/{filename}"

def education_certificate_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'freelancers/certifications/education/{instance.profile.user.id}/{instance.id}_education.{ext}'

def experience_certificate_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'freelancers/certifications/experience/{instance.profile.user.id}/{instance.id}_experience.{ext}'


# -----------------------------------
# CUSTOM VALIDATORS
# -----------------------------------

def validate_certificate_file(value):
    valid_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
    if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
        raise ValidationError('Only PDF, PNG, JPG, and JPEG files are allowed.')


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

    def clean(self):
        validator = URLValidator()
        for field in ['github_url', 'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url']:
            url = getattr(self, field)
            if url:
                try:
                    validator(url)
                except ValidationError:
                    raise ValidationError({field: 'Invalid URL'})

    def save(self, *args, **kwargs):
        self.clean()  # Ensure URLs are validated before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Social Links for {self.user.username}"

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['user'], name='unique_social_links_per_user'),
        ]

class Verification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification')
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    id_verified = models.BooleanField(default=False)
    video_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Verification for {self.user.username}"
    
    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['user'], name='unique_verification_per_user'),
        ]

# -----------------------------------
# FREELANCER PROFILE + RELATED
# -----------------------------------

class FreelancerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='freelancer_profile')
    profile_picture = models.ImageField(upload_to=freelancer_profile_picture_path, blank=True, null=True)
    about = models.TextField(max_length=2000, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(16), MaxValueValidator(100)])
    country = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    location = models.CharField(max_length=255)
    skills = models.ManyToManyField(Skill, blank=True, related_name='freelancers')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def verification(self):
        if hasattr(self.user, 'verification'):
            return self.user.verification
        return None


    def __str__(self):
        return self.first_name
    
    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

class Education(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='educations')
    college = models.CharField(max_length=128)
    degree = models.CharField(max_length=128)
    start_year = models.PositiveIntegerField(validators=[MinValueValidator(1900), MaxValueValidator(timezone.now().year)])
    end_year = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1900), MaxValueValidator(timezone.now().year)]
    )
    certificate = models.FileField(upload_to=education_certificate_path, blank=True, null=True, validators=[validate_certificate_file])

    def clean(self):
        if self.end_year and self.start_year > self.end_year:
            raise ValidationError({'end_year': 'End year must be after start year.'})
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.degree} at {self.college}"
    
    class Meta:
        indexes = [
            models.Index(fields=['profile']),
        ]

class Experience(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='experiences')
    role = models.CharField(max_length=128)
    company = models.CharField(max_length=128)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    ongoing = models.BooleanField(default=False)
    certificate = models.FileField(upload_to=experience_certificate_path, blank=True, null=True, validators=[validate_certificate_file])

    def clean(self):
        if not self.ongoing and not self.end_date:
            raise ValidationError('End date is required if the experience is not ongoing.')
        if self.ongoing and self.end_date:
            raise ValidationError('End date should not be set if the experience is ongoing.')
        if self.end_date and self.start_date > self.end_date:
            raise ValidationError('End date must be after start date.')


    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.role} at {self.company}"


    class Meta:
        indexes = [
            models.Index(fields=['profile']),
        ]

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

    class Meta:
        indexes = [
            models.Index(fields=['profile']),
        ]

class Portfolio(models.Model):
    profile = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='portfolios')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    project_link = models.URLField(blank=True, null=True, validators=[URLValidator()])
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['profile']),
        ]

# -----------------------------------
# CLIENT PROFILE + RELATED
# -----------------------------------

class ClientProfile(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('personal', 'Personal'),
        ('business', 'Business'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=16, choices=ACCOUNT_TYPE_CHOICES, default=None)
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='client_profile_picture_path', blank=True, null=True)
    company_name = models.CharField(max_length=128, blank=True)
    company_description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    industry = models.CharField(max_length=128, blank=True)
    company_size = models.CharField(max_length=64, blank=True)
    website = models.URLField(blank=True, null=True)
    project_types = models.JSONField(default=list, blank=True)
    budget_range = models.CharField(max_length=64, blank=True)
    project_frequency = models.CharField(max_length=64, blank=True)
    preferred_communications = models.JSONField(default=list, blank=True)
    working_hours = models.CharField(max_length=64, blank=True)
    business_goals = models.JSONField(default=list, blank=True)
    current_challenges = models.JSONField(default=list, blank=True)
    previous_experiences = models.CharField(max_length=64, blank=True)
    expected_timeline = models.CharField(max_length=64, blank=True)
    quality_importance = models.CharField(max_length=64, blank=True)
    payment_method = models.CharField(max_length=64, blank=True)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    project_budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_timing = models.CharField(max_length=64, blank=True)
    verification = models.OneToOneField(Verification, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.company_name})"

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]