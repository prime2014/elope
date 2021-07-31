import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer


logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s: %(message)s", level=logging.INFO)

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """The handshaking process and connecting process initiation"""
        logger.info(self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Responsible for disconnecting the websocket"""
        pass

    async def receive(self, text_data):
        """Listens for any kind of message and passes it as an argument on the receive method"""
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        await self.send(text_data=json.dumps({
            "message": message
        }))
