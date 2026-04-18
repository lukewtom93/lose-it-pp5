from rest_framework import generics, permissions
from .models import Food, MealEntry, DailyCalorieGoal
from .serializers import (
    FoodSerializer, MealEntrySerializer, DailyCalorieGoalSerializer)


class FoodList(generics.ListCreateAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Food.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MealEntryList(generics.ListCreateAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DailyCalorieGoalList(generics.ListCreateAPIView):
    serializer_class = DailyCalorieGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyCalorieGoal.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)