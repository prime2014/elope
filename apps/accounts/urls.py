from django.urls import re_path, include
from apps.accounts import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', viewset=views.UserViewset, basename="users")
router.register(r'address', viewset=views.AddressViewset, basename="address")


urlpatterns = [
    re_path(r'^api/v1/', include(router.urls)),
    re_path(r'^api/login/$', views.LoginAPIView.as_view()),
    re_path(r'^api/logout/$', views.LogoutAPIView.as_view())
]
