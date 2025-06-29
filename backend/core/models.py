from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=128, unique=True)
    icon = models.CharField(max_length=128, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name