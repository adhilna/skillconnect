import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillconnect.settings')

# Call django.setup() before importing any ORM-dependent modules
django.setup()

# Now import middleware and routing
from gigs.middleware import JWTAuthMiddleware
from gigs.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
