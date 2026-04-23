from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField


class Profile(models.Model):
    """
    Stores additional user profile information,
    including display name and profile image.
    """

    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    name = models.CharField(
        max_length=255,
        blank=True
    )

    image = CloudinaryField(
        "image",
        default="default_profile_crbj0v.jpg"
    )

    class Meta:
        """
        Show newest profiles first.
        """
        ordering = ["-created_at"]

    def __str__(self):
        """
        Human-readable profile representation.
        """
        return f"{self.owner}'s profile"


def create_profile(sender, instance, created, **kwargs):
    """
    Automatically create a profile when a new user is created.
    """
    if created:
        Profile.objects.create(
            owner=instance
        )


post_save.connect(
    create_profile,
    sender=User
)