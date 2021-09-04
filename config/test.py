"""
With these settings, tests run faster.
"""

from .settings import *  # noqa
from .settings import env

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="Hpx6wiVR5dGR1TGjcOQXnZvUu1D17VXXQ56hH1qHne3pkZCEM2PJrn1967SR0IOn",
)


ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]


EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
INSTALLED_APPS += ["debug_toolbar"]  # noqa F405
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa F405
DEBUG_TOOLBAR_CONFIG = {
    "DISABLE_PANELS": ["debug_toolbar.panels.redirects.RedirectsPanel"],
    "SHOW_TEMPLATE_CONTEXT": True,
}
INTERNAL_IPS = [
    "127.0.0.1",
]
if env("USE_DOCKER") == "yes":
    import socket

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [".".join(ip.split(".")[:-1] + ["1"]) for ip in ips]

INSTALLED_APPS += ["django_extensions"]
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_TASK_ALWAYS_EAGER = True

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        # 'rest_framework.permissions.IsAuthenticated'
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # 'rest_framework.authentication.SessionAuthentication',
        # 'maji.account.custom_authenticate.CustomTokenAuthentication',
    ],
}

TEST_RUNNER = "django.test.runner.DiscoverRunner"

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}
