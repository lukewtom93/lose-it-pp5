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
        return (
            f'{self.owner}: Starting weight - '
            f'{self.starting_weight}{self.weight_unit} '
            f'Goal weight - {self.goal_weight}{self.weight_unit}'
        )


class BodyWeightTracker(models.Model):
    body_weight = models.ForeignKey(
        BodyWeight,
        on_delete=models.CASCADE,
        related_name='entries',

    )
    current_weight = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.body_weight.owner}'s Current weight: {self.current_weight}"
            f"{self.body_weight.weight_unit} date:{self.created_at}"
        )
