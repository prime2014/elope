from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.accounts import routing as accounts_routing
from django.urls import path
from django.core.asgi import get_asgi_application
from channels.security.websocket import OriginValidator


websocket_urlpatterns = [
    path('ws/', URLRouter(accounts_routing.websocket_urlpatterns))
]


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": OriginValidator(AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),allowed_origins=[
            "http://127.0.0.1:8000",
            "http://localhost:8000"
        ]),
    }
)
