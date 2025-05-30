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
    # LASTNAME
    profile_picture = models.ImageField(upload_to='freelancers/profile_pics', blank=True, null=True)
    about = models.TextField(blank=True)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    # LAT AND LONG NOT REQUIRED FOR NOW
    linkedin_url = models.URLField(max_length=200, null=True, blank=True)
    github_url = models.URLField(max_length=200, null=True, blank=True)
    # THESE BOTH CAN BE EDITTED TO PORTFOLIO MODEL
    skills = models.ManyToManyField(Skill, blank=True)
    # SKILL AND EXPERIENCE WILL BE IN ONE MODEL 
    # THERE WILL BE A (MANY) FILE FIELD FOR UPLOADING YOUR CERTIFICATOIN
    verification = models.OneToOneField(Verification, on_delete=models.SET_NULL, null=True, blank=True)
    # MAY BE RECOSINDER ABOUT VERIFICATION FIELD
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
