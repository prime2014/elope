from rest_framework import viewsets, status, response, authentication, permissions
from apps.inventory import models
from apps.inventory import serializers
from rest_framework.decorators import action
import logging

logging.basicConfig(format="%(asctime)s %(levelname)s %(name)s %(message)s", level=logging.INFO)

logger = logging.getLogger(__name__)



class CategoryViewset(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    authentication_classes = ()
    permission_classes = ()
    serializer_class = serializers.CategorySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductViewset(viewsets.ModelViewSet):
    queryset = models.Products.objects.all()
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.ProductSerializer

    def list(self, request, *args, **kwargs):
        logger.info(request.COOKIES)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            resp = response.Response(serializer.data, status=status.HTTP_201_CREATED)
            return resp
        else:
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET'], detail=False)
    def get_latest_three_items(self, request, *args, **kwargs):
        qs = models.Products.objects.all()[0:3]
        serializers = self.serializer_class(instance=qs, many=True)
        return response.Response(serializers.data, status=status.HTTP_200_OK)


class StockViewset(viewsets.ModelViewSet):
    queryset = models.Stock.objects.all()
    authentication_classes = ()
    permission_classes = ()
    serializer_class = serializers.StockSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return response.Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class ProductImagesViewset(viewsets.ModelViewSet):
    queryset = models.ProductImages.objects.all()
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.ProductImagesSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return response.Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
