from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.order.views import OrderViewset, CartViewset, PlaceOrderViewset, MpesaPayment, BatchOrderViewset,\
    PaymentForOrders

router = DefaultRouter()
router.register(r'order', viewset=OrderViewset, basename="order")
router.register(r'cart', viewset=CartViewset)
router.register(r'payment', viewset=PaymentForOrders)
router.register(r'place-order', viewset=PlaceOrderViewset)
router.register(r'batch-order', viewset=BatchOrderViewset)


urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('mpesa/', MpesaPayment.as_view(), name="mpesa")
]
