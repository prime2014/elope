from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.payments.views import PaymentViewset

router = DefaultRouter()
router.register("payments", viewset=PaymentViewset, basename="transaction")

urlpatterns = [
    path("api/v1/", include(router.urls))
]
