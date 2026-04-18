from rest_framework import generics, permissions
from django.utils import timezone
from rest_framework.response import Response
from .models import Food, MealEntry, DailyCalorieGoal
from .serializers import (
    FoodSerializer, MealEntrySerializer, DailyCalorieGoalSerializer)
from rest_framework.views import APIView


class FoodList(generics.ListCreateAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Food.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FoodDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Food.objects.filter(owner=self.request.user)


class MealEntryList(generics.ListCreateAPIView):
    """
    Meal entry list which then can filter queryset by date
    for easier access for frontend to display daily meals
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


class MealEntryDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(owner=self.request.user)


class DailyCalorieGoalList(generics.ListCreateAPIView):
    serializer_class = DailyCalorieGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyCalorieGoal.objects.filter(owner=self.request.user)
   
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TodayCalorieGoalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        goal, _ = DailyCalorieGoal.objects.get_or_create(
            owner=request.user,
            date=today,
            defaults={'calorie_goal': 2000}
        )
        serializer = DailyCalorieGoalSerializer(goal)
        return Response(serializer.data)

    def put(self, request):
        today = timezone.localdate()
        goal, _ = DailyCalorieGoal.objects.get_or_create(
            owner=request.user,
            date=today,
            defaults={'calorie_goal': 2000}
        )

        serializer = DailyCalorieGoalSerializer(
            goal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user, date=today)
        return Response(serializer.data)

