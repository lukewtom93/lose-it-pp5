from rest_framework import serializers
from .models import Food, MealEntry, DailyCalorieGoal


class FoodSerializer(serializers.ModelSerializer):
    """
    Serializes reusable food items created by a user.
    """

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    class Meta:
        """
        Defines fields returned in food API responses.
        """
        model = Food
        fields = [
            "id",
            "owner",
            "name",
            "serving_size",
            "serving_unit",
            "calories",
            "protein",
            "carbs",
            "fat",
            "created_at",
            "updated_at",
        ]


class MealEntrySerializer(serializers.ModelSerializer):
    """
    Serializes meal log entries and calculated nutrition totals.
    """

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    # Include related food data for easier frontend display
    food_name = serializers.ReadOnlyField(
        source="food.name"
    )

    serving_unit = serializers.ReadOnlyField(
        source="food.serving_unit"
    )

    class Meta:
        """
        Defines meal entry fields returned in the API.
        """
        model = MealEntry

        fields = [
            "id",
            "owner",
            "food",
            "food_name",
            "meal_type",
            "quantity",
            "serving_unit",
            "consumed_at",
            "created_at",
            "updated_at",
            "total_calories",
            "total_protein",
            "total_carbs",
            "total_fat",
        ]


class DailyCalorieGoalSerializer(serializers.ModelSerializer):
    """
    Serializes daily calorie targets.
    """

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    class Meta:
        """
        Fields exposed for daily calorie goal records.
        """
        model = DailyCalorieGoal

        fields = [
            "id",
            "owner",
            "date",
            "calorie_goal",
        ]