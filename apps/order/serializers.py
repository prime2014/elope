import json
from rest_framework import serializers
from apps.order import models
from apps.inventory.models import Products
from django.core import validators
from apps.inventory.models import Stock
from apps.accounts.serializers import UserSerializer, AddressSerializer
from decimal import Decimal, getcontext
from django.http import JsonResponse
import logging
from rest_framework import exceptions

logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s %(message)s", level=logging.INFO)

logger = logging.getLogger(__name__)

getcontext().prec = 2


class CartSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(
        default=1,
        validators=[validators.MinValueValidator(1), ],
        required=False
    )

    cart_owner = serializers.ReadOnlyField(
        source="cart_owner.pk"
    )
    product_name = serializers.SerializerMethodField()
    image_urls = serializers.SerializerMethodField()

    class Meta:
        model = models.Cart
        fields = (
            "id",
            "cart_owner",
            "order_detail",
            "product_name",
            "item",
            "currency",
            "quantity",
            "price",
            "net_total",
            "image_urls"
        )
        extra_kwargs = {
            'net_total': {'read_only': True}
        }

    def get_product_name(self, obj):
        logger.info("THE OBJECT IS: %s" % obj)
        return Products.objects.get(pk=obj.item.pk).name

    def get_image_urls(self, obj):
        url = "http://127.0.0.1:8000"
        image_urls = [
            f"{url}{image.image.url}" for image in obj.item.images.all()
        ]
        return image_urls

    def validate(self, validated_data):
        product = validated_data.get("item")
        quantity = validated_data.get("quantity")

        stock = Stock.objects.get(product=product).quantity

        if quantity > stock:
            raise serializers.ValidationError(f"We have fewer items in stock than requested. Stock"
                                              f" is {stock}")
        return validated_data

    def create(self, validated_data):
        quantity = validated_data.get("quantity", 1)
        request = self.context['request']

        # get the draft order associated with the logged-in user if it exists
        # otherwise create it
        order, _ = models.Order.objects.get_or_create(customer=request.user, status="DRAFT")
        item = validated_data.get("item")

        # save cart item
        try:
            cart_item = models.Cart.objects.get(cart_owner=request.user, item=item, order_detail=order)
            cart_item.quantity += quantity
            cart_item.price = cart_item.item.price
        except models.Cart.DoesNotExist:
            cart_item = models.Cart.objects.create(cart_owner=request.user, item=item, order_detail=order, quantity=quantity)
            cart_item.price = cart_item.item.price
        cart_item.save()

        if hasattr(cart_item, "price"):
            cart_item.net_total = Decimal(cart_item.quantity) * Decimal(cart_item.price)
            cart_item.save(update_fields=['net_total'])

        # update stock
        stock = Stock.objects.get(product=item)
        if cart_item:
            stock.quantity -= quantity
            stock.save()
        return cart_item

    def update(self, instance, validated_data):
        # Quantity is the only thing in the cart that needs to be updated
        item = validated_data.get("item")
        new_quantity = validated_data.get("quantity")
        diff = new_quantity - instance.quantity
        stock = Stock.objects.get(product=item)
        if diff > 0:
            instance.quantity += diff
            stock.decrease_stock(diff)
        elif diff < 0:
            logger.info("SUBTRACTING... %s" % stock)
            instance.quantity -= abs(diff)
            stock.increase_stock(abs(diff))
        else:
            instance.quantity = instance.quantity
        instance.net_total = Decimal(instance.quantity) * Decimal(instance.price)
        instance.save(update_fields=['net_total', 'quantity'])
        return instance


class BatchCartSerializer(CartSerializer):
    class Meta(CartSerializer.Meta):
        fields = (
            "id",
            "cart_owner",
            "order_detail",
            "item",
            "currency",
            "quantity",
            "price",
            "net_total"
        )
        extra_kwargs = {}

    def validate(self, validated_data):
        return super().validate(validated_data)







class OrderSerializer(serializers.ModelSerializer):
    customer = UserSerializer(
        many=False,
        read_only=True
    )
    item_order = CartSerializer(
        many=True,
        read_only=True
    )

    shipping_address = AddressSerializer(
        many=False,
        read_only=True
    )

    class Meta:
        model = models.Order
        fields = (
            "id",
            "customer",
            "order_id",
            "status",
            "shipping_address",
            "currency",
            "discount",
            "shipping_price",
            "sub_total",
            "total",
            "date_of_order",
            "item_order"
        )
        extra_kwargs = {
            'sub_total': {'read_only': True},
            'total': {'read_only': True}
        }

    def create(self, validated_data):
        return models.Order.objects.create(**validated_data)


class PlaceOrderSerializer(OrderSerializer):
    class Meta(OrderSerializer.Meta):
        fields = (
            "id",
            "status",
            "sub_total",
            "total"
        )

        OrderSerializer.Meta.extra_kwargs.clear()

    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.sub_total = validated_data.get("sub_total", instance.sub_total)
        instance.total = validated_data.get("total", instance.total)
        instance.save()
        return instance

