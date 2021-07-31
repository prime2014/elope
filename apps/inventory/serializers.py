from rest_framework import serializers
from apps.inventory import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = (
            "id",
            "name",
            "image"
        )

    def create(self, validated_data):
        return models.Category.objects.create(**validated_data)


class ProductSerializer(serializers.ModelSerializer):
    image_urls = serializers.SerializerMethodField(method_name="get_image_urls")

    class Meta:
        model = models.Products
        fields = (
            "id",
            "category",
            "sku",
            "name",
            "slug",
            "short_description",
            "description",
            "rating",
            "currency",
            "quantity",
            "price",
            "discount",
            "pub_date",
            "image_urls"
        )

    def create(self, validated_data):
        return models.Products.objects.create(**validated_data)

    def get_image_urls(self, obj):
        url = "http://127.0.0.1:8000"
        img_urls = [
            f"{url}{image.image.url}" for image in obj.images.all()
        ]
        return img_urls


class StockSerializer(serializers.ModelSerializer):
    product = ProductSerializer(
        read_only=True,
        many=False
    )

    class Meta:
        model = models.Stock
        fields = (
            "id",
            "product",
            "quantity"
        )

    def create(self, validated_data):
        return models.Stock.objects.create(**validated_data)

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("This product is out of stock")

    def validate(self, attrs):
        pass


class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImages
        fields = (
            "id",
            "item",
            "image"
        )

    def create(self, validated_data):
        return models.ProductImages.objects.create(**validated_data)
