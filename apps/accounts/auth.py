from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from apps.accounts.models import User


class AuthenticateUser(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
            if user and check_password(password, user.password):
                return user
        except User.DoesNotExist:
            pass
        return None

    def get_user(self, user_id):
        return super().get_user(user_id=user_id)
