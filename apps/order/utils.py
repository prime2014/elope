import requests
from requests.auth import HTTPBasicAuth
import json
import environ
from apps.order.mpesa_credentals import URLEnum
import time
import logging
import base64
from datetime import datetime

logger = logging.getLogger(__name__)


env = environ.Env()


class MpesaGateway:
    expiry = None
    token = None

    def __init__(self):
        self.consumer_key = env("CONSUMER_KEY")
        self.consumer_secret = env("CONSUMER_SECRET")
        self.BusinessShortCode = env("BUSINESS_SHORT_CODE")
        self.passkey = env("PASS_KEY")
        self.timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        self.password = base64.b64encode(str(
            self.BusinessShortCode +
            self.passkey +
            self.timestamp).encode()).decode("UTF-8")
        self.partyB = env("BUSINESS_SHORT_CODE")
        self.callBackUrl = URLEnum.CallBackURL.value
        self.transactiontype = URLEnum.TransactionType.value
        self.account_reference = URLEnum.AccountReference.value
        self.transactionDesc = URLEnum.TransactionDesc.value

    def getAccessToken(self):
        """Fetches the api endpoint"""
        try:
            req = requests.get(url=URLEnum.AUTH_URL.value, auth=HTTPBasicAuth(
                self.consumer_key,
                self.consumer_secret
            ))
        except BaseException as exc:
            logger.error("Could not get the access token: %s", exc)
            raise BaseException(exc)
        else:
            json_token = req.text
            access = json.loads(json_token)
            logger.info("THE ACCESS TOKEN: %s", access)
            self.__class__.expiry = time.time() + 3400
            self.__class__.token = access.get("access_token")
            return access

    def refresh_token(self, amount, phone, url):
        """Refreshes the access token upon expiry"""
        if MpesaGateway.expiry is None or MpesaGateway.expiry < time.time():
            try:
                self.getAccessToken()
            except BaseException as exc:
                raise BaseException(exc)
            else:
                return self.send_payment(amount, phone, url)
        else:
            return self.send_payment(amount, phone, url)

    def send_payment(self, amount, phone, url):
        """Send the payment details to the sandbox api endpoint"""
        headers = {}
        headers["Authorization"] = f"Bearer {MpesaGateway.token}"
        payment = {
            "BusinessShortCode": int(self.BusinessShortCode),
            "Password": self.password,
            "Timestamp": self.timestamp,
            "TransactionType": self.transactiontype,
            "Amount": amount,
            "PartyA": phone,
            "PartyB": int(self.BusinessShortCode),
            "PhoneNumber": phone,
            "CallBackURL": url,
            "AccountReference": self.account_reference,
            "TransactionDesc": "Payment of ORDER"
        }
        try:
            logger.info("THIS IS PAYMENT %s", payment)
            req = requests.post(url=URLEnum.STK_URL.value, json=payment, headers=headers)
        except BaseException as exc:
            logger.error(exc.with_traceback)
            raise BaseException(exc)
        else:
            logger.info(req.text)
            logger.info(req.headers)
            return json.dumps(req.json())
