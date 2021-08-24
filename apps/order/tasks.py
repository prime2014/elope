from config.celery_app import app as celery_app
from apps.order.utils import MpesaGateway
import logging
import channels.layers
from asgiref.sync import async_to_sync

channel_layer = channels.layers.get_channel_layer()

logger = logging.getLogger(__name__)

# data = async_to_sync(channel_layer.receive)("mpesa")

# logger.info(data)

@celery_app.task(serializer="json")
def send_payment_details(data):
    mpesa = MpesaGateway()
    resp = mpesa.refresh_token(data.get("total"), data.get("phone"))
    logging.info("********************* %s" % resp)
    return resp
