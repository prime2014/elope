from rest_framework.routers import DefaultRouter
from django.urls import re_path, include
from apps.inventory import views

router = DefaultRouter()
router.register(r'products', views.ProductViewset)
router.register(r'stock', views.StockViewset)
router.register(r'images', views.ProductImagesViewset)
router.register(r'category', views.CategoryViewset)

urlpatterns = [
    re_path(r'^api/v1/', include(router.urls))
]
