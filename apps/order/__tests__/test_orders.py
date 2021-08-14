import pytest
from apps.order.models import Cart, Order
from rest_framework.test import APIClient


@pytest.mark.django_db(transaction=True)
def test_cart_addition(user_login, create_products):
    response = user_login.post('/orders/api/v1/cart/', data={'item':create_products.pk, 'price':create_products.price})
    assert response.status_code == 201
