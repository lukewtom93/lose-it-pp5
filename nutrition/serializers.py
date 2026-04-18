from rest_framework import serializers
from .models import Food, MealEntry, DailyCalorieGoal


class FoodSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Food
        fields = [
            'id',
            'owner',
            'name',
            'serving_size',
            'serving_unit',
            'calories',
            'protein',
            'carbs',
            'fat',
            'created_at',
            'updated_at',
        ]


class MealEntrySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    food_name = serializers.ReadOnlyField(source='food.name')
    serving_unit = serializers.ReadOnlyField(source='food.serving_unit')

    class Meta:
        model = MealEntry
        fields = [
            'id',
            'owner',
            'food',
            'food_name',
            'meal_type',
            'quantity',
            'serving_unit',
            'consumed_at',
            'created_at',
            'updated_at',
            'total_calories',
            'total_protein',
            'total_carbs',
            'total_fat',
        ]


class DailyCalorieGoalSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = DailyCalorieGoal
        fields = [
            'id',
            'owner',
            'date',
            'calorie_goal',
        ]
