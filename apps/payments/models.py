from django.db import models
from django.db.models.deletion import SET_NULL
from django.utils.translation import ugettext_lazy as _
from apps.order.models import Order


class Transaction(models.Model):
    MEANS = [
        ('MPESA', 'Pay Through Mpesa'),
        ('Paypal', 'Paypal'),
        ('BANK', 'Pay Through Bank'),
        ('COD', 'Cash On Delivery')
    ]

    means = models.CharField(
        max_length=100,
        choices=MEANS,
        default="MPESA"
    )
    order = models.OneToOneField(
        Order,
        related_name="order_transaction",
        on_delete=models.SET_NULL,
        null=True
    )
    amount = models.DecimalField(
        max_digits=9,
        decimal_places=2
    )
    payment_date = models.DateTimeField(
        auto_now_add=True,
        editable=False
    )

