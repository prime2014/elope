from enum import Enum
import environ


env = environ.Env()




class URLEnum(Enum):
    AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    STK_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    CallBackURL= str("https://" + env("NGROK_DOMAIN") + "/orders/mpesa/")
    TransactionType = "CustomerPayBillOnline"
    AccountReference= "Watchmen"
    TransactionDesc= "Payment of Order"
