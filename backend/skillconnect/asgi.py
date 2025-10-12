import os
from django.core.asgi import get_asgi_application

# Use development settings for local, override in production
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillconnect.settings.development')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models
django_asgi_app = get_asgi_application()

# NOW import channels and routing AFTER Django is initialized
from channels.routing import ProtocolTypeRouter, URLRouter
from gigs.middleware import JWTAuthMiddleware
from gigs.routing import websocket_urlpatterns as gigs_websocket_urlpatterns
from messaging.routing import websocket_urlpatterns as messaging_websocket_urlpatterns

# Use the stored django_asgi_app variable, not a function call
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(gigs_websocket_urlpatterns + messaging_websocket_urlpatterns)
    ),
})
