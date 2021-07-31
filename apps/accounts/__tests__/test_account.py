import pytest
from apps.accounts.models import User
from rest_framework.test import APIClient


@pytest.mark.parametrize("email, first_name, last_name, password",
    [
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
    assert user.email == email
    assert user.password == password


@pytest.mark.django_db(transaction=True)
def test_user_api_view():
    url = "/accounts/api/v1/users/"
    request = APIClient()
    response = request.post(url, data={"first_name": "Prime", "last_name": "Omondi", "email": "omondiprime@mail.com", "password":"belindat2014"})
    assert response.status_code == 201


# @pytest.mark.django_db(transaction=True)
# def test_login():
#     credentials = {
#         "email": "caroline.oluoch@mail.com",
#         "password": "belindat2014",
#         "first_name": "Caroline",
#         "last_name": "Oluoch"
#     }
#     User.objects.create(**credentials)
#     url = "/accounts/api/login/"
#     request = APIClient()
#     response = request.post(url, data={"email": credentials.get("email"),"password": credentials.get("password")})
#     assert response.status_code == 200
