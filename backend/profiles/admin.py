from django.contrib import admin
from .models import (
    FreelancerProfile, ClientProfile, Skill, Verification, Education,
    Experience, Language, Portfolio, SocialLinks
)

@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'location', 'is_available')
    search_fields = ('first_name', 'user__email', 'location')
    list_filter = (['is_available'])

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    get_full_name.short_description = 'Full Name'

# @admin.register(ClientProfile)
# class ClientProfileAdmin(admin.ModelAdmin):
#     list_display = ('full_name', 'user', 'company_name', 'location')
#     search_fields = ('full_name', 'user__email', 'company_name')

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
    list_display = ('profile', 'role', 'company', 'start_date', 'end_date')
    search_fields = ('profile__full_name', 'role', 'company')


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('profile', 'name', 'proficiency')
    search_fields = ('profile__full_name', 'name')

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title', 'project_link')
    search_fields = ('profile__first_name', 'title')
