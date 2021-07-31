from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.core import validators
from phonenumber_field.modelfields import PhoneNumberField


class Address(models.Model):
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(max_length=40, validators=[validators.EmailValidator(message="Invalid Email Address")])
    phone = PhoneNumberField()
    company = models.CharField(max_length=30, null=True, blank=True)
    country = models.CharField(max_length=20)
    town = models.CharField(max_length=40)
    address_line_1 = models.CharField(max_length=40)
    address_line_2 = models.CharField(max_length=30, null=True, blank=True)
    district = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name + ": " + self.address_line_1


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_active=False, **extra_fields):
        user = self.model(email=email, is_active=is_active, **extra_fields)
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(
        self,
        email,
        password,
        is_active=True,
        is_superuser=True,
        is_staff=True,
        **extra_fields
    ):
        return self.create_user(email, password, is_active, is_superuser, is_staff, **extra_fields)

    def is_staff(self):
        return self.is_staff


class User(AbstractBaseUser):
    email = models.EmailField(
        unique=True,
        max_length=40,
        null=False
    )
    first_name = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    last_name = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(
        default=False,
        blank=True
    )
    is_superuser = models.BooleanField(
        default=False,
        blank=True
    )
    is_staff = models.BooleanField(
        default=False,
        blank=True
    )
    date_joined = models.DateTimeField(
        editable=False,
        default=timezone.now
    )

    USERNAME_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def has_perm(self, perm, obj=None):
        return self.is_superuser or self.is_active

    def has_module_perms(self, app_label):
        return self.is_superuser or self.is_active

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
