# Generated by Django 4.2 on 2025-06-01 05:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_rename_cerificate_experience_certificate'),
    ]

    operations = [
        migrations.AddField(
            model_name='education',
            name='certificate',
            field=models.FileField(blank=True, null=True, upload_to='freelancers/certifications/education_certificates'),
        ),
    ]
