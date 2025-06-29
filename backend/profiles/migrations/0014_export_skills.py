from django.db import migrations

def export_skills(apps, schema_editor):
    OldSkill = apps.get_model('profiles', 'Skill')
    NewSkill = apps.get_model('core', 'Skill')
    for skill in OldSkill.objects.all():
        NewSkill.objects.create(id=skill.id, name=skill.name)

def reverse_export(apps, schema_editor):
    NewSkill = apps.get_model('core', 'Skill')
    NewSkill.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('profiles', '0013_alter_language_proficiency'),  # Your existing dependency
        ('core', '0001_initial'),  # Ensure this is after core's initial migration
    ]

    operations = [
        migrations.RunPython(export_skills, reverse_export),
    ]
