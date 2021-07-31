from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.accounts import routing as accounts_routing
from django.urls import path
from django.core.asgi import get_asgi_application


websocket_urlpatterns = [
    path('ws/', URLRouter(accounts_routing.websocket_urlpatterns))
]


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
