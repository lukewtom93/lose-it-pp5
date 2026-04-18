from django.urls import path
from nutrition import views

urlpatterns = [
    path('food/', views.Food.as_view()),

]