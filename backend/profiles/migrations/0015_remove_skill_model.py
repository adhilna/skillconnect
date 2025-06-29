from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('profiles', '0014_export_skills'),  # After the export_skills migration
    ]

    operations = [
        migrations.RemoveField(
            model_name='freelancerprofile',
            name='skills',
        ),
        migrations.DeleteModel(
            name='Skill',
        ),
    ]

