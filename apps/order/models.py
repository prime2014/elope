from django.db import models
from django.contrib.auth import get_user_model
from apps.inventory.models import Products
import uuid
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal, getcontext
from django.db.models import Q
from django.db.models.signals import post_save
from apps.payments.models import Transaction


getcontext().prec = 2


user = get_user_model()

STATUS = [
    ('DRAFT', _("DRAFT")),
    ("PLACED", _("PLACED")),
    ('CONFIRMED', _('CONFIRMED')),
    ('FULFILLED', _('FULFILLED')),
    ('CANCELLED', _('CANCELLED'))
]


class Order(models.Model):
    customer = models.ForeignKey(
        user,
        on_delete=models.CASCADE,
        related_name="user_order",
        null=True
    )
    order_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        max_length=8
    )
    status = models.CharField(
        choices=STATUS,
        default="DRAFT",
        max_length=60
    )
    currency = models.CharField(max_length=20, default="KES", blank=True, null=True)
    discount = models.DecimalField(
        decimal_places=2,
        max_digits=9,
        null=True
    )
    shipping_address = models.ForeignKey(
        "accounts.Address",
        related_name="ship_address",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shipping_price = models.DecimalField(
        decimal_places=2,
        max_digits=9,
        null=True
    )
    # shipping_address = models.ForeignKey(
    #
    # )
    sub_total = models.DecimalField(
        decimal_places=2,
        max_digits=9,
        null=True
    )
    total = models.DecimalField(
        decimal_places=2,
        max_digits=9,
        null=True
    )
    date_of_order = models.DateTimeField(
        auto_now=True,
        editable=False
    )

    def __str__(self):
        return f"ORDER ID: {self.order_id}"

    class Meta:
        ordering = ('date_of_order',)
        verbose_name_plural = "Order"
        constraints = [
            models.UniqueConstraint(fields=['customer'], condition=Q(status="DRAFT"), name="customer_unique_draft")
        ]

    def cancel_order(self):
        if self.status in ['CONFIRMED']:
            self.status = "CANCELLED"
            return self.save(update_fields=['status'])
        return None


class Cart(models.Model):
    cart_owner = models.ForeignKey(
        user,
        on_delete=models.CASCADE,
        related_name="user_cart",
        null=True,
        blank=True
    )
    order_detail = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="item_order",
        null=True,
        blank=True
    )
    item = models.ForeignKey(
        Products,
        null=True,
        related_name="product_in_cart",
        on_delete=models.SET_NULL,
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(1, "The quantity cannot go below one")],
        default=1,
    )
    price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        blank=True,
        null=True
    )
    currency = models.CharField(
        max_length=30,
        default="KES",
        blank=True,
        null=True
    )
    net_total = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        null=True
    )

    def __str__(self):
        return f"{self.item.name}"

    class Meta:
        ordering = ("-pk",)
        verbose_name_plural = "Cart"

    def update_net_total(self) -> any:
        self.net_total = Decimal(self.price) * Decimal(self.quantity)
        self.save(update_fields=['net_total'])


def activate_payment(sender, created, instance, **kwargs):
    if created:
        Transaction.objects.create(order=instance, customer=instance.customer)


post_save.connect(activate_payment, sender=Order)
