import six
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class ActivationToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return six.text_type(user.get('id')) + six.text_type(user.get('is_active')) + six.text_type(timestamp)


activation_token = ActivationToken()


class ResetPassword(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp: int) -> str:
        return six.text_type(user.get("id")) + six.text_type(timestamp)
