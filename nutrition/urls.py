from django.urls import path
from nutrition import views

urlpatterns = [
    path('food/', views.FoodList.as_view()),
    path('food/<int:pk>', views.FoodDetail.as_view()),
    path('meal-entry/', views.MealEntryList.as_view()),
    path('meal-entry/<int:pk>', views.MealEntryDetail.as_view()),
    path('daily-calorie-goal/', views.DailyCalorieGoalList.as_view()),
]
