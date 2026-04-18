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


