# Generated by Django 4.2 on 2025-06-02 06:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('profiles', '0007_delete_certification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='portfolio',
            name='github_url',
        ),
        migrations.RemoveField(
            model_name='portfolio',
            name='linkedin_url',
        ),
        migrations.AlterField(
            model_name='portfolio',
            name='project_link',
            field=models.URLField(blank=True, null=True),
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
    ]
