from config.celery_app import app as celery_app
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


@celery_app.task()
def send_activation_link(user, token):
    context = {}
    email = user.get("email")
    context['first_name'] = user.get("first_name")
    context['last_name'] = user.get("last_name")
    context["uid"] = urlsafe_base64_encode(force_bytes(user.get("id")))
    context['token'] = token
    msg_html = render_to_string('account/activate_account.html', context)
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(
        "ACCOUNT ACTIVATION",
        msg_html,
        from_email,
        [email],
        html_message=msg_html
    )
