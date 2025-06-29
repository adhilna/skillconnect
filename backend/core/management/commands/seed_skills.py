from django.core.management.base import BaseCommand
from core.models import Skill

class Command(BaseCommand):
    help = 'Seed initial skills into the Skill model'

    def handle(self, *args, **kwargs):
        skills = [
            'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'C++', 'Swift',
            'UI/UX Design', 'Graphic Design', 'Photoshop', 'Illustrator', 'Figma',
            'Content Writing', 'Copywriting', 'SEO', 'Digital Marketing', 'Social Media',
            'Video Editing', 'Photography', 'Data Analysis', 'Machine Learning'
        ]

        created = 0
        for skill_name in skills:
            skill, was_created = Skill.objects.get_or_create(name=skill_name)
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created} new skills.'))
