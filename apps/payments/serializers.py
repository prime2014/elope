from rest_framework.serializers import ModelSerializer
from apps.payments.models import Transaction
from apps.order.serializers import OrderSerializer
from rest_framework import serializers


class PaymentSerializer(ModelSerializer):
    payment_date = serializers.DateTimeField(input_formats=["%Y%m%d%H%M%S"])

    class Meta:
        model = Transaction
        fields = (
            "pk",
            "receipt_no",
            "phone_number",
            "means",
            "customer",
            "order",
            "amount",
            "payment_date"
        )

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        obj["order"] = OrderSerializer(instance=instance.order).data
        return obj

    def create(self, validated_data):
        return Transaction.objects.create(**validated_data)
