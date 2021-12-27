from apps.accounts import serializers, models
from rest_framework import response, status, viewsets, permissions, authentication
from rest_framework.views import APIView
from apps.accounts.auth import AuthenticateUser
from django.contrib.auth import login, logout
from apps.accounts.tasks import send_activation_link
from apps.accounts.utils import activation_token
from rest_framework.response import Response
from rest_framework.decorators import action


class AddressViewset(viewsets.ModelViewSet):
    queryset = models.Address.objects.all()
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.AddressSerializer

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data)

        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        auth = AuthenticateUser()
        user = auth.authenticate(request=request, username=email, password=password)
        if user:
            login(request, user, backend="apps.accounts.auth.AuthenticateUser")
            return response.Response({
                'token': user.auth_token.key,
                'user': serializers.UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return response.Response({
            'error': 'Invalid User Credentials'
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
            return response.Response({'success': 'Logout Successful'}, status=status.HTTP_200_OK)


class UserViewset(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user, token = [serializer.data, activation_token.make_token(serializer.data)]
            send_activation_link.delay(user, token)
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        token = request.data.get("token")
        u = self.get_object()
        user = self.serializer_class(u)

        if user and activation_token.check_token(user.data, token):
            u.is_active = True
            u.save()
            return response.Response("success", status=status.HTTP_200_OK)
        return response.Response("invalid", status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET'], detail=True)
    def resend_activation_link(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_active is not True:
            serializers = self.serializer_class(instance=user)
            token = activation_token.make_token(serializers.data)
            send_activation_link.delay(serializers.data, token)
            return response.Response(
                {'status': "An activation link has been sent"},
                status=status.HTTP_200_OK
            )
        return response.Response(
            {'error': 'This account has already been activated'},
            status=status.HTTP_400_BAD_REQUEST
        )
