from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging
from django.contrib.auth import get_user_model
from apps.order.tasks import send_payment_details
from rest_framework import exceptions

User = get_user_model()

logger = logging.getLogger(__name__)


class MpesaPaymentChannel(AsyncWebsocketConsumer):
    """Connect to this channel to facilitate mpesa payment instead of using HTTP/1.1"""
    async def connect(self):
        logger.info(self.scope['user'])
        self.room_name = self.scope['url_route']['kwargs']['pk']
        await self.accept()

    async def disconnect(self, code):
        await self.close()

    async def receive(self, text_data):
        """Receives payment details then sends the data to a celery worker"""
        # This approach allows django to reserve HTTP for basic requests
        # Long running / uncertain processes like payment will be handled by websocket through this channel
        data = json.loads(text_data)
        try:
            result = send_payment_details.apply_async(args=[data, ],
                                                      serializer="json",
                                                      retry=True,
                                                      retry_policy={
                                                          'max_retries': 3,
                                                          'interval_start': 0,
                                                          'interval_step': 0.2,
                                                          'interval_max': 0.2
                                                      }
                                                      )
        except exceptions.APIException():
            raise exceptions.ErrorDetail("Server response time error")
        else:
            if result:
                response = json.loads(result.get())
                await self.send(text_data=json.dumps(response))
