from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.db import close_old_connections
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        user = User.objects.get(id=user_id)
        logger.debug(f"Authenticated user from token: {user}")
        return user
    except User.DoesNotExist:
        logger.warning(f"User with id {user_id} not found.")
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = scope.get('query_string', b'').decode()
        logger.debug(f"Query string from scope during WebSocket connection: {query_string}")
        params = parse_qs(query_string)
        token = params.get('token')
        
        if token:
            try:
                validated_token = UntypedToken(token[0])
                user_id = validated_token['user_id']
                logger.info(f"Token valid. User ID: {user_id}")
                scope['user'] = await get_user(user_id)
            except (InvalidToken, TokenError) as e:
                logger.error(f"Invalid or expired token in WebSocket connection: {e}")
                scope['user'] = AnonymousUser()
        else:
            logger.warning("No token found in WebSocket connection query params.")
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
