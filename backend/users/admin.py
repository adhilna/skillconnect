from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


# Custom UserAdmin to manage User model
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for User model, customized for SkillConnect.
    """
    list_display = ['email', 'role', 'phone', 'is_active','first_login', 'is_staff', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff','first_login']
    search_fields = ['email', 'phone']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('role', 'phone', 'first_login')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'role', 'phone', 'password1', 'password2', 'is_staff', 'is_superuser', 'first_login'),
        }),
    )
    readonly_fields = ['last_login', 'date_joined']
    filter_horizontal = ()

# Register User with custom UserAdmin
admin.site.register(User, UserAdmin)

# Customize admin site branding
admin.site.site_header = "SkillConnect Admin"
admin.site.site_title = "SkillConnect Portal"
admin.site.index_title = "Welcome to SkillConnect Dashboard"