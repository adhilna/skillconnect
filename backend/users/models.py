from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email fieldmust be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('worker', 'Worker'),
        ('admin', 'Admin')
    )
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=128)
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return self.full_name
    
class WorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='workerprofile', limit_choices_to={'role': 'worker'})
    skills = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    availability = models.TextField(blank=True)
    certifications = models.TextField(blank=True)
    location = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return f"Worker Profile for {self.user.email}"
