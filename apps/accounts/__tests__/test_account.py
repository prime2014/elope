import pytest
from apps.accounts.models import User
# from rest_framework.test import APIClient


@pytest.mark.parametrize("email, first_name, last_name, password", [
                                ("prime@mail.com", "Prime", "omondi", "belindat2014"),
                                ("belinda@mail.com", "Belinda", "Atieno", "belindat2014"),
                                ("lynne@mail.com", "Lynne", "Akinyi", "belindat2014")
                        ]
                        )
@pytest.mark.django_db
def test_account_creation(email, first_name, last_name, password):
    data = {
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
        'password': password
    }
    user = User.objects.create(**data)
    if user.email != email:
        raise AssertionError
    if user.password != password:
        raise AssertionError

# @pytest.mark.django_db(transaction=True)
# def test_user_api_view():
#     url = "/accounts/api/v1/users/"
#     request = APIClient()
#     response = request.post(url, data={
#         "first_name": "Prime",
#         "last_name": "Omondi",
#         "email": "omondiprime@mail.com",
#         "password": "belindat2014"
#     })
#     assert response.status_code == 201
