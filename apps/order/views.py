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
from rest_framework.views import APIView
import logging
from rest_framework.exceptions import PermissionDenied
from apps.order.forms import FilterClientOrder
from django_filters import rest_framework as filters
from django.http import HttpResponse
from apps.order.tasks import send_payment_details
from rest_framework.response import Response
from apps.inventory.models import Products
from functools import reduce
from decimal import Decimal, getcontext
from rest_framework import exceptions

getcontext().prec = 2


logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s: %(message)s",
                    level=logging.INFO)
logger = logging.getLogger(__name__)


class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = ()
    authentication_classes = (authentication.TokenAuthentication,
                              authentication.SessionAuthentication)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = FilterClientOrder

    def get_queryset(self):
        if self.request.user.is_staff:
            qs = Order.objects.all().order_by("-date_of_order")
            return qs
        elif self.request.user.is_authenticated:
            qs = Order.objects.filter(customer=self.request.user).order_by(
                "-date_of_order")
            return qs
        else:
            raise exceptions.NotAuthenticated()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user, status="DRAFT")

    @action(methods=['POST'], detail=False)
    def mpesa_callback(self, request, *args, **kwargs):
        pass

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


class MpesaPayment(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, *args, **kwargs):
        result = send_payment_details.delay()
        return HttpResponse(result.get())

    def post(self, request, *args, **kwargs):
        logger.info(request.data)
        return HttpResponse(request.data)
