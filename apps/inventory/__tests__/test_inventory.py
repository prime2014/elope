import pytest
from apps.inventory.models import Category, Products, Stock
from rest_framework.test import APIClient
import logging


logger = logging.getLogger(__name__)

@pytest.mark.django_db(transaction=True)
@pytest.mark.parametrize(
    "name",
    [
        ("Antique",),
        ("Men",),
        ("Women")
    ]
)
def test_category(name):
    data = Category.objects.create(name=name)
    assert Category.objects.count() > 0
    assert data.name == name


@pytest.mark.django_db(transaction=True)
def test_products(create_products):
    assert create_products.name == "Beauty Watch"
    assert create_products.price == "500.00"


@pytest.mark.django_db(transaction=True)
def test_stock_creation(create_products):
    assert create_products.product_stock.quantity == 100
    assert create_products.product_stock.product == create_products


@pytest.mark.django_db(transaction=True)
def test_products_api_view():
    request = APIClient()
    response = request.get('/inventory/api/v1/products/')
    assert response.status_code == 200




