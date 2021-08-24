from django.urls import path
from apps.accounts.consumers import ChatConsumer
from apps.order.consumers import MpesaPaymentChannel
import logging

logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s %(message)s", level=logging.DEBUG)

logger = logging.getLogger(__name__)

websocket_urlpatterns = [
    path('help/service/', ChatConsumer.as_asgi()),
    path('mpesa/payment/<int:pk>/', MpesaPaymentChannel.as_asgi())
]
