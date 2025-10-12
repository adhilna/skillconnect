import os

# Automatically select settings based on DJANGO_ENV environment variable
DJANGO_ENV = os.getenv('DJANGO_ENV', 'development')

if DJANGO_ENV == 'production':
    from .production import *
elif DJANGO_ENV == 'development':
    from .development import *
else:
    from .base import *
