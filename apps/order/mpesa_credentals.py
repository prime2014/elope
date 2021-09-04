from enum import Enum


class URLEnum(Enum):
    AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    STK_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    CallBackURL = "https://efd4-105-231-186-15.ngrok.io/orders/mpesa/"
    TransactionType = "CustomerPayBillOnline"
    AccountReference = "Watchmen"
    TransactionDesc = "Payment of Order"
