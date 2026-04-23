from rest_framework import generics, permissions
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Food, MealEntry, DailyCalorieGoal
from .serializers import (
    FoodSerializer,
    MealEntrySerializer,
    DailyCalorieGoalSerializer,
)


class FoodList(generics.ListCreateAPIView):
    """
    Lists all food items created by the authenticated user
    and allows new food items to be created.
    """

    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restrict food results to the logged-in user's data.
        """
        return Food.objects.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):
        """
        Automatically assign ownership to current user.
        """
        serializer.save(owner=self.request.user)


class FoodDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates or deletes a single food item.
    """

    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Prevent users accessing food items they do not own.
        """
        return Food.objects.filter(
            owner=self.request.user
        )


class MealEntryList(generics.ListCreateAPIView):
    """
    Lists meal entries and allows users to create new entries.

    Supports optional date filtering to return meals
    for a selected day.
    """

    serializer_class = MealEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return user's meal entries and optionally filter by date.
        """
        queryset = MealEntry.objects.filter(
            owner=self.request.user
        )

        date = self.request.query_params.get("date")

        if date:
            queryset = queryset.filter(
                consumed_at__date=date
            )

        return queryset

    def perform_create(self, serializer):
        """
        Assign ownership to current user on meal creation.
        """
        serializer.save(owner=self.request.user)


class MealEntryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates or deletes a single meal entry.
    """

    serializer_class = MealEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restrict access to meal entries owned by user.
        """
        return MealEntry.objects.filter(
            owner=self.request.user
        )


class DailyCalorieGoalList(generics.ListCreateAPIView):
    """
    Lists daily calorie goal records and allows creation.
    """

    serializer_class = DailyCalorieGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return calorie goals belonging to current user.
        """
        return DailyCalorieGoal.objects.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):
        """
        Assign ownership when creating a goal.
        """
        serializer.save(owner=self.request.user)


class TodayCalorieGoalView(APIView):
    """
    Returns today's calorie goal.

    Automatically creates a default goal if one does not exist
    and allows the current day's goal to be updated.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Retrieve or create today's calorie goal.
        """
        today = timezone.localdate()

        goal, _ = DailyCalorieGoal.objects.get_or_create(
            owner=request.user,
            date=today,
            defaults={"calorie_goal": 2000},
        )

        serializer = DailyCalorieGoalSerializer(goal)

        return Response(serializer.data)

    def put(self, request):
        """
        Update today's calorie goal.
        """
        today = timezone.localdate()

        goal, _ = DailyCalorieGoal.objects.get_or_create(
            owner=request.user,
            date=today,
            defaults={"calorie_goal": 2000},
        )

        serializer = DailyCalorieGoalSerializer(
            goal,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        serializer.save(
            owner=request.user,
            date=today,
        )

        return Response(serializer.data)