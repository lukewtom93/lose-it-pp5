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
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    weight_unit = models.CharField(
        max_length=2,
        choices=UNIT_CHOICES,
        default='kg',
    )
    starting_weight = models.DecimalField(max_digits=5, decimal_places=2)
    goal_weight = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.owner}, {self.starting_weight}, {self.goal_weight}'
