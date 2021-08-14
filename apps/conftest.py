import pytest
from apps.inventory.models import Products
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token


User = get_user_model()


@pytest.mark.django_db(transaction=True)
@pytest.fixture()
def create_products():
    products = Products.objects.create(
        name="Beauty Watch",
        description="Just a beautiful watch",
        price="500.00"
    )
    return products


@pytest.mark.django_db(transaction=True)
@pytest.fixture()
def create_user():
    user = User.objects.create(
        email="abc@net",
        first_name="abc",
        last_name="net",
        password="abcnet"
    )
    Token.objects.create(user=user)
    return user


@pytest.mark.django_db(transaction=True)
@pytest.fixture()
def user_login(create_user):
    client = APIClient()
    client.login(email="abc@net", password="abcnet")
    client.force_authenticate(user=create_user)
    return client
