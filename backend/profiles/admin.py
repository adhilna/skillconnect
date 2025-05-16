from django.contrib import admin
from .models import (
    FreelancerProfile, ClientProfile, Skill, Verification, Education,
    Experience, Certification, Language, Portfolio
)

@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'location_name', 'is_available')
    search_fields = ('full_name', 'user__email', 'location_name')
    list_filter = (['is_available'])

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'company_name', 'location_name')
    search_fields = ('full_name', 'user__email', 'company_name')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = (['name'])

@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ('email_verified', 'phone_verified', 'id_verified', 'video_verified')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('profile', 'degree', 'college', 'year')
    search_fields = ('profile__full_name', 'degree', 'college')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('profile', 'role', 'company', 'duration')
    search_fields = ('profile__full_name', 'role', 'company')

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title', 'organization')

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('profile', 'name', 'proficiency')
    search_fields = ('profile__full_name', 'name')

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('freelancer', 'title', 'link')
    search_fields = ('freelancer__full_name', 'title')
