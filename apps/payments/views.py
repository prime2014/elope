from rest_framework.viewsets import ModelViewSet
from apps.payments.models import Transaction
from rest_framework.response import Response
from rest_framework import status, authentication, permissions
from apps.payments.serializers import PaymentSerializer


class PaymentViewset(ModelViewSet):
    queryset = Transaction.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    serializer_class = PaymentSerializer

    # def get_queryset(self):
    #     if self.request.user.is_staff:
    #         qs = Transaction.objects.all()
    #         return qs
    #     elif self.request.user.is_authenticated:
    #         qs = Transaction.objects.

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)

        if serializers.is_valid(raise_exception=True):
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
