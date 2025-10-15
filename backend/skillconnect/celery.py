from celery import Celery
import os
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillconnect.settings.production')
app = Celery('skillconnect')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()