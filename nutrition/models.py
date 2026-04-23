from django.db import models
from django.contrib.auth.models import User


class Food(models.Model):
    """
    Stores reusable food items and nutritional values.
    """

    UNIT_CHOICES = [
        ("g", "Grams"),
        ("ml", "Millilitres"),
        ("each", "Each"),
        ("slice", "Slice"),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="foods"
    )

    name = models.CharField(
        max_length=100
    )

    serving_size = models.DecimalField(
        max_digits=100,
        decimal_places=2
    )

    serving_unit = models.CharField(
        max_length=12,
        choices=UNIT_CHOICES,
        default="g"
    )

    calories = models.PositiveIntegerField()

    protein = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )

    carbs = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )

    fat = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        """
        Order food alphabetically.
        """
        ordering = ["name"]

    def __str__(self):
        return self.name


class MealEntry(models.Model):
    """
    Stores logged meals and calculates nutrition totals
    based on selected food and quantity.
    """

    MEAL_CHOICES = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="food_entries"
    )

    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE,
        related_name="entries"
    )

    meal_type = models.CharField(
        max_length=20,
        choices=MEAL_CHOICES
    )

    quantity = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=1
    )

    consumed_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        """
        Show newest meal entries first.
        """
        ordering = ["-consumed_at"]

    def __str__(self):
        return f"{self.owner} - {self.food.name}"

    @property
    def total_calories(self):
        """
        Calculate calories based on quantity consumed.
        """
        return round(
            self.food.calories * self.quantity, 2
        )

    @property
    def total_protein(self):
        """
        Calculate protein total.
        """
        return round(
            self.food.protein * self.quantity, 2
        )

    @property
    def total_carbs(self):
        """
        Calculate carbohydrate total.
        """
        return round(
            self.food.carbs * self.quantity, 2
        )

    @property
    def total_fat(self):
        """
        Calculate fat total.
        """
        return round(
            self.food.fat * self.quantity, 2
        )


class DailyCalorieGoal(models.Model):
    """
    Stores a user's calorie target for a given date.
    Only one goal per user per day is allowed.
    """

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="calorie_goals"
    )

    date = models.DateField()

    calorie_goal = models.PositiveIntegerField(
        default=2000
    )

    class Meta:
        """
        Enforce one goal per user per date.
        """
        ordering = ["-date"]

        unique_together = [
            "owner",
            "date"
        ]

    def __str__(self):
        return (
            f"{self.owner} - "
            f"{self.date} - "
            f"{self.calorie_goal}"
        )