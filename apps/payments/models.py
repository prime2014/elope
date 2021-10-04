from django.db import models
from apps.accounts.models import User


class Transaction(models.Model):
    MEANS = [
        ('MPESA', 'Pay Through Mpesa'),
        ('Paypal', 'Paypal'),
        ('BANK', 'Pay Through Bank'),
        ('COD', 'Cash On Delivery')
    ]

    receipt_no = models.CharField(
        max_length=20
    )

    phone_number = models.CharField(
        max_length=40,
        null=True
    )

    means = models.CharField(
        max_length=100,
        choices=MEANS,
        default="MPESA"
    )
    customer = models.ForeignKey(
        User,
        related_name="user_pay",
        on_delete=models.CASCADE,
        null=True
    )
    order = models.OneToOneField(
        "order.Order",
        related_name="order_transaction",
        on_delete=models.SET_NULL,
        null=True
    )
    amount = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        null=True
    )
    payment_date = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.order}"
