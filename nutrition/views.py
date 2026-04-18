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
    """
    Meal entry list which then can filter by date
    """
    serializer_class = MealEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MealEntry.objects.filter(owner=self.request.user)

        date = self.request.query_params.get('date')
   
        if date:
            queryset = queryset.filter(consumed_at__date=date)

        return queryset
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DailyCalorieGoalList(generics.ListCreateAPIView):
    serializer_class = DailyCalorieGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyCalorieGoal.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)