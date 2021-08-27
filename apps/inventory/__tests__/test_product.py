import pytest
from apps.inventory.models import Products
from decimal import Decimal, getcontext

getcontext().prec = 2


@pytest.mark.django_db(transaction=True)
def test_price_change(create_products):
    create_products.change_price(400.54)
    assert Products.objects.get(pk=create_products.pk).price == Decimal("400.54")
