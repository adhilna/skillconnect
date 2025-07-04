from django.contrib import admin
from django.utils.html import format_html
from .models import (
    FreelancerProfile, Education, Experience, Language, Portfolio,
    SocialLinks, Verification
)
from core.models import Skill

# --- Inline classes for related models ---

class EducationInline(admin.TabularInline):
    model = Education
    extra = 0
    readonly_fields = ['certificate_link']

    def certificate_link(self, obj):
        if obj.certificate:
            return format_html('<a href="{}" target="_blank">View</a>', obj.certificate.url)
        return "-"
    certificate_link.short_description = "Certificate"

class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 0
    readonly_fields = ['certificate_link']

    def certificate_link(self, obj):
        if obj.certificate:
            return format_html('<a href="{}" target="_blank">View</a>', obj.certificate.url)
        return "-"
    certificate_link.short_description = "Certificate"

class LanguageInline(admin.TabularInline):
    model = Language
    extra = 0

class PortfolioInline(admin.TabularInline):
    model = Portfolio
    extra = 0

# --- Custom Display Methods ---

def social_links_display(self, obj):
    try:
        links = obj.user.sociallinks
        return format_html(
            '<br>'.join([
                f'<a href="{links.github_url}" target="_blank">GitHub</a>',
                f'<a href="{links.linkedin_url}" target="_blank">LinkedIn</a>',
                f'<a href="{links.twitter_url}" target="_blank">Twitter</a>',
                f'<a href="{links.facebook_url}" target="_blank">Facebook</a>',
                f'<a href="{links.instagram_url}" target="_blank">Instagram</a>',
            ])
        )
    except SocialLinks.DoesNotExist:
        return "-"
social_links_display.short_description = "Social Links"

def verification_display(self, obj):
    try:
        v = obj.user.verification
        badges = []
        if v.email_verified: badges.append("✅ Email")
        if v.phone_verified: badges.append("📱 Phone")
        if v.id_verified: badges.append("🪪 ID")
        if v.video_verified: badges.append("🎥 Video")
        return ", ".join(badges) or "None"
    except Verification.DoesNotExist:
        return "-"
verification_display.short_description = "Verifications"




# --- Main FreelancerProfile admin ---

@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = (
        'get_full_name', 'location', 'is_available', 'profile_pic_thumb', 'skills_list'
    )
    search_fields = ('first_name', 'last_name', 'user__email', 'location', 'skills__name')
    list_filter = ('is_available', 'country', 'skills')
    inlines = [EducationInline, ExperienceInline, LanguageInline, PortfolioInline]
    readonly_fields = ['profile_pic_preview', 'social_links_display', 'verification_display']

    fieldsets = (
        (None, {
            'fields': (
                'first_name', 'last_name', 'location', 'is_available',
                'profile_picture', 'profile_pic_preview',
                'social_links_display', 'verification_display',
            )
        }),
    )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    get_full_name.short_description = 'Full Name'

    def profile_pic_thumb(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="max-height: 50px; border-radius: 4px;" />',
                obj.profile_picture.url
            )
        return "-"
    profile_pic_thumb.short_description = "Profile Pic"

    def profile_pic_preview(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="max-height: 200px; border-radius: 8px;" />',
                obj.profile_picture.url
            )
        return "-"
    profile_pic_preview.short_description = "Profile Picture Preview"

    def skills_list(self, obj):
        return ", ".join([skill.name for skill in obj.skills.all()])
    skills_list.short_description = "Skills"

    def social_links_display(self, obj):
        try:
            links = obj.user.sociallinks
            return format_html(
                '<br>'.join([
                    f'<a href="{links.github_url}" target="_blank">GitHub</a>',
                    f'<a href="{links.linkedin_url}" target="_blank">LinkedIn</a>',
                    f'<a href="{links.twitter_url}" target="_blank">Twitter</a>',
                    f'<a href="{links.facebook_url}" target="_blank">Facebook</a>',
                    f'<a href="{links.instagram_url}" target="_blank">Instagram</a>',
                ])
            )
        except SocialLinks.DoesNotExist:
            return "-"
    social_links_display.short_description = "Social Links"

    def verification_display(self, obj):
        try:
            v = obj.user.verification
            badges = []
            if v.email_verified: badges.append("✅ Email")
            if v.phone_verified: badges.append("📱 Phone")
            if v.id_verified: badges.append("🪪 ID")
            if v.video_verified: badges.append("🎥 Video")
            return ", ".join(badges) or "None"
        except Verification.DoesNotExist:
            return "-"
    verification_display.short_description = "Verifications"

# --- Register Skill model ---

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# --- Register SocialLinks and Verification for admin access ---

@admin.register(SocialLinks)
class SocialLinksAdmin(admin.ModelAdmin):
    list_display = ('user', 'github_url', 'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url')
    search_fields = ('user__username', 'github_url', 'linkedin_url')

@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_verified', 'phone_verified', 'id_verified', 'video_verified')
    search_fields = ('user__username',)

# --- Register Portfolio, Language, Education, Experience for completeness ---

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title', 'project_link')
    search_fields = ('profile__first_name', 'title')

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('profile', 'name', 'proficiency')
    search_fields = ('profile__first_name', 'name')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('profile', 'degree', 'college', 'start_year', 'end_year', 'certificate_link')
    search_fields = ('profile__first_name', 'degree', 'college')
    readonly_fields = ['certificate_link']

    def certificate_link(self, obj):
        if obj.certificate:
            return format_html('<a href="{}" target="_blank">View</a>', obj.certificate.url)
        return "-"
    certificate_link.short_description = "Certificate"

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('profile', 'role', 'company', 'start_date', 'end_date', 'certificate_link')
    search_fields = ('profile__first_name', 'role', 'company')
    readonly_fields = ['certificate_link']

    def certificate_link(self, obj):
        if obj.certificate:
            return format_html('<a href="{}" target="_blank">View</a>', obj.certificate.url)
        return "-"
    certificate_link.short_description = "Certificate"
