from apps.accounts import models
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "country",
            "town",
            "address_line_1",
            "address_line_2",
            "district",
            "postal_code"
        )

    def create(self, validated_data):
        return models.Address.objects.create(**validated_data)


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "is_active",
            "is_superuser",
            "is_staff",
            "date_joined"
        )

        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'write_only': True},
            'is_superuser': {'write_only': True}
        }

    def create(self, validated_data):
        user = models.User.objects.create_user(**validated_data)
        user.save()
        if user:
            Token.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        super(UserSerializer, self).update(instance, validated_data)
        instance.password = validated_data.get("password", instance.password)
        instance.password = make_password(instance.password)
        instance.save()
        return instance
