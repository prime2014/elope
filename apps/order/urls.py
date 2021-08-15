from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.order.views import OrderViewset, CartViewset, PlaceOrderViewset

router = DefaultRouter()
router.register(r'order', viewset=OrderViewset)
router.register(r'cart', viewset=CartViewset)
router.register(r'place-order', viewset=PlaceOrderViewset)


urlpatterns = [
    path('api/v1/', include(router.urls))
]
