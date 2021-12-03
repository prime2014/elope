from apps.accounts import serializers
from rest_framework import (
    viewsets,
    response,
    status,
    authentication,
    permissions
)
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from apps.order.serializers import (
    OrderSerializer,
    CartSerializer,
    PlaceOrderSerializer
)
from apps.order.models import Order, Cart
from apps.accounts.models import Address
from apps.inventory.models import Stock
import logging
from rest_framework.exceptions import PermissionDenied
from apps.order.forms import FilterClientOrder
from django_filters import rest_framework as filters
from django.http import HttpResponse
from rest_framework.response import Response
from apps.inventory.models import Products
from functools import reduce
from decimal import Decimal, getcontext
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.generics import GenericAPIView
from django.contrib.auth import get_user


channel_layer = get_channel_layer()

getcontext().prec = 2


logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s: %(message)s",
                    level=logging.INFO)
logger = logging.getLogger(__name__)


class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = [authentication.TokenAuthentication,
                              authentication.SessionAuthentication]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = FilterClientOrder

    def get_queryset(self):
        if self.request.user.is_staff:
            qs = Order.objects.all().order_by("-date_of_order")
            return qs
        elif get_user(self.request).is_authenticated:
            qs = Order.objects.filter(customer=self.request.user).order_by(
                "-date_of_order")
            return qs
        else:
            raise PermissionDenied()

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
                serialize = self.serializer_class(data={'shipping_address': a},
                                                  instance=get_object_or_404(Order, pk=kwargs['pk']), partial=True)
                if serialize.is_valid(raise_exception=True):
                    serialize.save(shipping_address=a)
                    orders = self.serializer_class(instance=get_object_or_404(Order, pk=kwargs['pk']))
                return response.Response(orders.data, status=status.HTTP_201_CREATED)
            else:
                return response.Response(address.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return None


class PaymentForOrders(OrderViewset):
    OrderViewset.authentication_classes = ()
    OrderViewset.permission_classes = ()

    @action(methods=['POST'], detail=True)
    def mpesa(self, request, *args, **kwargs):
        stkCallback = request.data["Body"]["stkCallback"]
        if stkCallback["ResultCode"] == 0:
            logger.info(self.request.data)
            async_to_sync(channel_layer.group_send(str(self.get_object().pk), {
                          "type": "payment_result", **request.data}))
            return HttpResponse(request.data)
        elif stkCallback["ResultCode"] == 1032:
            logger.info(request.data)
            logger.info(self.request.user)
            data = self.get_object().pk
            async_to_sync(channel_layer.send(str(data), {"type": "payment_result", **request.data}))
            return HttpResponse(request.data)
        else:
            return HttpResponse("You have insufficient funds in your account")


class BatchOrderViewset(viewsets.ModelViewSet):
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            qs = Order.objects.all()
        elif self.request.user.is_authenticated:
            qs = Order.objects.filter(customer=self.request.user).order_by("-date_of_order")
        else:
            qs = None
        return qs

    def get_product(self, item):
        return Products.objects.get(pk=item)

    def create(self, request, *args, **kwargs):
        order, _ = Order.objects.get_or_create(customer=request.user, status="DRAFT")

        data = [Cart(
            cart_owner=request.user,
            quantity=obj.get("quantity"),
            item=self.get_product(obj.get("item")),
            order_detail=order,
            price=obj.get("price"),
            net_total=obj.get("net_total"))
            for obj in request.data
        ]
        cart = Cart.objects.bulk_create(data)
        net_total = [obj.net_total for obj in cart]
        logger.info(net_total)
        total = reduce(lambda x, y: Decimal(x) + Decimal(y), net_total)
        order.status = "PLACED"
        order.total = total
        order.sub_total = total
        order.save(update_fields=["status", "sub_total", "total"])
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user, status="PLACED")


class PlaceOrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = PlaceOrderSerializer
    permission_classes = ()
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)

    def perform_update(self, serializer):
        serializer.save(customer=self.request.user)


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
            raise PermissionDenied()

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


class MpesaPayment(GenericAPIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, *args, **kwargs):
        return HttpResponse("<h1>WELCOME</h1>")

    def post(self, request, *args, **kwargs):
        stkCallback = request.data["Body"]["stkCallback"]
        if stkCallback["ResultCode"] == 0:
            data = str(request.user).replace(" ", "_")
            async_to_sync(channel_layer.send(str(data), {"type": "payment_result", **request.data}))
            return HttpResponse(request.data)
        elif stkCallback["ResultCode"] == 1032:
            logger.info(request.data)
            logger.info(self.request.user)
            data = str(self.request.user).replace(" ", "_")
            async_to_sync(channel_layer.group_send(str(data), {"type": "payment_result", **request.data}))
            return HttpResponse(request.data)
        else:
            return HttpResponse("You have insufficient funds in your account")
