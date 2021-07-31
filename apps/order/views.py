from apps.accounts import serializers
from rest_framework import viewsets, response, status, authentication, permissions
from rest_framework.decorators import action
from apps.order.serializers import (
    OrderSerializer,
    CartSerializer
)
from apps.order.models import Order, Cart
from apps.accounts.models import Address
from apps.inventory.models import Stock
import logging
from django.shortcuts import get_object_or_404


logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)


class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = ()
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)

    def get_queryset(self):
        if self.request.user.is_staff:
            qs = Order.objects.all().order_by("-date_of_order")
        elif self.request.user.is_authenticated:
            qs = Order.objects.filter(customer=self.request.user).order_by("-date_of_order")
        else:
            qs = None
        return qs

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user, status="DRAFT")

    @action(methods=['PATCH', 'GET'], detail=True)
    def add_shipping_address(self, request, *args, **kwargs):
        if self.request.method == "GET":
            order = self.serializer_class(instance=get_object_or_404(Order, pk=kwargs['pk']))
            return response.Response(order.data, status=status.HTTP_200_OK)
        elif self.request.method == "PATCH":
            address = serializers.AddressSerializer(data=request.data)
            if address.is_valid(raise_exception=True):
                address.save()
                a = Address.objects.get(pk=address.data.get("id"))
                serialize = self.serializer_class(data={'shipping_address': a}, instance=get_object_or_404(Order, pk=kwargs['pk']), partial=True)
                if serialize.is_valid(raise_exception=True):
                    serialize.save(shipping_address=a)
                    orders = self.serializer_class(instance=get_object_or_404(Order, pk=kwargs['pk']))
                return response.Response(orders.data, status=status.HTTP_201_CREATED)
            else:
                return response.Response(address.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return None


class CartViewset(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = (permissions.AllowAny, )
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]

    def get_queryset(self):
        if self.request.user.is_staff:
            cart = Cart.objects.all()
            return cart
        elif self.request.user.is_authenticated:
            cart = Cart.objects.filter(cart_owner=self.request.user)
            return cart
        else:
            raise None

    def perform_create(self, serializer):
        draft_order, _ = Order.objects.get_or_create(customer=self.request.user, status="DRAFT")
        serializer.save(cart_owner=self.request.user, order_detail=draft_order)

    def perform_update(self, serializer):
        draft_order, _ = Order.objects.update_or_create(customer=self.request.user, status="DRAFT")
        serializer.save(cart_owner=self.request.user, order_detail=draft_order)

    def perform_destroy(self, instance):
        product_stock = Stock.objects.get(product=instance.item)
        product_stock.quantity += instance.quantity
        product_stock.save()
        instance.delete()


