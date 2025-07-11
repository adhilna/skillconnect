# Generated by Django 4.2 on 2025-06-30 06:30

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import profiles.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FreelancerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to=profiles.models.freelancer_profile_picture_path)),
                ('about', models.TextField(blank=True, max_length=2000)),
                ('age', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(16), django.core.validators.MaxValueValidator(100)])),
                ('country', models.CharField(blank=True, max_length=100)),
                ('first_name', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
                ('location', models.CharField(max_length=255)),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('skills', models.ManyToManyField(blank=True, related_name='freelancers', to='core.skill')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='freelancer_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Verification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email_verified', models.BooleanField(default=False)),
                ('phone_verified', models.BooleanField(default=False)),
                ('id_verified', models.BooleanField(default=False)),
                ('video_verified', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='verification', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SocialLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('github_url', models.URLField(blank=True, null=True)),
                ('linkedin_url', models.URLField(blank=True, null=True)),
                ('twitter_url', models.URLField(blank=True, null=True)),
                ('facebook_url', models.URLField(blank=True, null=True)),
                ('instagram_url', models.URLField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='social_links', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('project_link', models.URLField(blank=True, null=True, validators=[django.core.validators.URLValidator()])),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolios', to='profiles.freelancerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('proficiency', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('fluent', 'Fluent'), ('native', 'Native')], max_length=128)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='languages', to='profiles.freelancerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(max_length=128)),
                ('company', models.CharField(max_length=128)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('description', models.TextField(blank=True)),
                ('ongoing', models.BooleanField(default=False)),
                ('certificate', models.FileField(blank=True, null=True, upload_to=profiles.models.experience_certificate_path)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='profiles.freelancerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('college', models.CharField(max_length=128)),
                ('degree', models.CharField(max_length=128)),
                ('start_year', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1900), django.core.validators.MaxValueValidator(2025)])),
                ('end_year', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1900), django.core.validators.MaxValueValidator(2025)])),
                ('certificate', models.FileField(blank=True, null=True, upload_to=profiles.models.education_certificate_path)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='educations', to='profiles.freelancerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='ClientProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account_type', models.CharField(choices=[('personal', 'Personal'), ('business', 'Business')], default=None, max_length=16)),
                ('first_name', models.CharField(max_length=128)),
                ('last_name', models.CharField(blank=True, max_length=128, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='client_profile_picture_path')),
                ('company_name', models.CharField(blank=True, max_length=128)),
                ('company_description', models.TextField(blank=True)),
                ('location', models.CharField(max_length=255)),
                ('industry', models.CharField(blank=True, max_length=128)),
                ('company_size', models.CharField(blank=True, max_length=64)),
                ('website', models.URLField(blank=True, null=True)),
                ('project_types', models.JSONField(blank=True, default=list)),
                ('budget_range', models.CharField(blank=True, max_length=64)),
                ('project_frequency', models.CharField(blank=True, max_length=64)),
                ('preferred_communications', models.JSONField(blank=True, default=list)),
                ('working_hours', models.CharField(blank=True, max_length=64)),
                ('business_goals', models.JSONField(blank=True, default=list)),
                ('current_challenges', models.JSONField(blank=True, default=list)),
                ('previous_experiences', models.CharField(blank=True, max_length=64)),
                ('expected_timeline', models.CharField(blank=True, max_length=64)),
                ('quality_importance', models.CharField(blank=True, max_length=64)),
                ('payment_method', models.CharField(blank=True, max_length=64)),
                ('monthly_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('project_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('payment_timing', models.CharField(blank=True, max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('verification', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='profiles.verification')),
            ],
        ),
        migrations.AddIndex(
            model_name='verification',
            index=models.Index(fields=['user'], name='profiles_ve_user_id_513c77_idx'),
        ),
        migrations.AddConstraint(
            model_name='verification',
            constraint=models.UniqueConstraint(fields=('user',), name='unique_verification_per_user'),
        ),
        migrations.AddIndex(
            model_name='sociallinks',
            index=models.Index(fields=['user'], name='profiles_so_user_id_fecbbc_idx'),
        ),
        migrations.AddConstraint(
            model_name='sociallinks',
            constraint=models.UniqueConstraint(fields=('user',), name='unique_social_links_per_user'),
        ),
        migrations.AddIndex(
            model_name='portfolio',
            index=models.Index(fields=['profile'], name='profiles_po_profile_010b85_idx'),
        ),
        migrations.AddIndex(
            model_name='language',
            index=models.Index(fields=['profile'], name='profiles_la_profile_2a95a2_idx'),
        ),
        migrations.AddIndex(
            model_name='freelancerprofile',
            index=models.Index(fields=['user'], name='profiles_fr_user_id_5e3ae0_idx'),
        ),
        migrations.AddIndex(
            model_name='experience',
            index=models.Index(fields=['profile'], name='profiles_ex_profile_7d6e70_idx'),
        ),
        migrations.AddIndex(
            model_name='education',
            index=models.Index(fields=['profile'], name='profiles_ed_profile_5e5b90_idx'),
        ),
        migrations.AddIndex(
            model_name='clientprofile',
            index=models.Index(fields=['user'], name='profiles_cl_user_id_8ca3ca_idx'),
        ),
    ]
