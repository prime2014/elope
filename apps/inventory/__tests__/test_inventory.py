import pytest
from apps.inventory.models import Category
from rest_framework.test import APIClient
import logging


logger = logging.getLogger(__name__)


@pytest.mark.django_db(transaction=True)
@pytest.mark.parametrize(
    "name",
    [
        ("Antique",),
        ("Men",),
        ("Women",)
    ]
)
def test_category(name):
    data = Category.objects.create(name=name)
    if Category.objects.count() <= 0:
        raise AssertionError
    if data.name != name:
        raise AssertionError


@pytest.mark.django_db(transaction=True)
def test_products(create_products):
    if create_products.name != "Beauty Watch":
        raise AssertionError
    if create_products.price != "500.00":
        raise AssertionError


@pytest.mark.django_db(transaction=True)
def test_stock_creation(create_products):
    if create_products.product_stock.quantity != 100:
        raise AssertionError
    if create_products.product_stock.product != create_products:
        raise AssertionError


@pytest.mark.django_db(transaction=True)
def test_products_api_view():
    request = APIClient()
    response = request.get('/inventory/api/v1/products/')
    if response.status_code != 200:
        raise AssertionError
