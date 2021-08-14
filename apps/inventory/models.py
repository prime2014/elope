from django.db import models
from autoslug import AutoSlugField
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid
from django.db.models import F


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )
    image = models.ImageField(
        upload_to="category",
        blank=True,
        null=True
    )

    class Meta:
        ordering = ('name',)
        verbose_name_plural = "Category"

    def __str__(self):
        return f"{self.name}"


class Products(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="product_cat",
        null=True
    )
    sku = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        max_length=8
    )
    name = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    slug = AutoSlugField(
        populate_from="name",
        max_length=200,
        null=True,
        blank=True
    )
    short_description = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        default=0.0,
        max_digits=2,
        decimal_places=1
    )
    currency = models.CharField(
        default="KES",
        max_length=40,
        blank=True,
        null=True
    )
    quantity = models.IntegerField(
        default=0,
        null=True,
        blank=True
    )
    price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        null=True
    )
    discount = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        null=True
    )
    pub_date = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    def __str__(self):
        return f"{self.name}"

    def change_price(self, value: float) -> any:
        self.price = value
        return self.save(update_fields=['price'])

    def change_discount(self, value: float) -> any:
        self.discount = value
        return self.save(update_fields=['discount'])

    class Meta:
        ordering = ('-pub_date',)
        verbose_name_plural = "Products"


class ProductImages(models.Model):
    item = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(
        upload_to="products",
        null=True,
        blank=True
    )


class Stock(models.Model):
    product = models.OneToOneField(
        Products,
        on_delete=models.CASCADE,
        related_name="product_stock"
    )
    quantity = models.IntegerField(
        default=0,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.product.name}"

    def decrease_stock(self, quantity):
        self.quantity = F("quantity") - quantity
        self.save(update_fields=['quantity'])

    def increase_stock(self, quantity):
        self.quantity = F("quantity") + quantity
        self.save(update_fields=['quantity'])


@receiver(post_save, sender=Products)
def created_product(sender, created, instance, **kwargs):
    if created:
        Stock.objects.create(product=instance, quantity=100)
