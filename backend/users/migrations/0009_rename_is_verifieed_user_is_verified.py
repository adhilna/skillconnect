# Generated by Django 4.2 on 2025-05-21 09:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_user_is_verifieed_user_otp_user_otp_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_verifieed',
            new_name='is_verified',
        ),
    ]
