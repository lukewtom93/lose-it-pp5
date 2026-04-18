from django.urls import path
from nutrition import views

urlpatterns = [
    path('food/', views.FoodList.as_view()),
    path('food/<int:pk>', views.FoodList.as_view()),
    path('mealentry/', views.MealEntryList.as_view()),
    path('dailycaloriegoal/', views.DailyCalorieGoalList.as_view()),
]
