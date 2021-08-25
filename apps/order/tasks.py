from config.celery_app import app as celery_app
from apps.order.utils import MpesaGateway
import logging
import channels.layers
from django.core import exceptions

logger = logging.getLogger(__name__)

# data = async_to_sync(channel_layer.receive)("mpesa")

# logger.info(data)

@celery_app.task(serializer="json")
def send_payment_details(data):
    mpesa = MpesaGateway()
    try:
        resp = mpesa.refresh_token(data.get("total"), data.get("phone"))
    except exceptions.RequestAborted as exc:
        raise exceptions.RequestAborted()
    else:
        logging.info("********************* %s" % resp)
        return resp
