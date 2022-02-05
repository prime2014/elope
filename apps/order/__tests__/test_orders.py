import pytest


cart_url = "/orders/api/v1/cart/"
order_url = "/orders/api/v1/order/"


@pytest.mark.django_db(transaction=True)
def test_cart_addition(user_login, create_products):
    response = user_login.post(cart_url, data={'item': create_products.pk, 'price': create_products.price})
    if response.status_code != 201:
        raise AssertionError
