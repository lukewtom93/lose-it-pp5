from django.db import models
from django.contrib.auth.models import User


class BodyWeight(models.Model):
    """
    Body weight
    """
    UNIT_CHOICES = [
        ('kg', 'Kilograms'),
        ('lb', 'Pounds'),
        ('st', 'Stone')
    ]
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    starting_weight = models.CharField(
        max_length=5,
        choices=UNIT_CHOICES,
        default='kg'
    )
    goal_weight = models.CharField(
        max_length=5,
        choices=UNIT_CHOICES,
        default='kg'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.owner}, {self.starting_weight}, {self.goal_weight}'
