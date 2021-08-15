from django_filters import rest_framework as filters
from apps.order.models import Order


class FilterClientOrder(filters.FilterSet):
    class Meta:
        model = Order
        fields = ("customer", "status")
