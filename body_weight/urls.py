from django.urls import path
from body_weight import views

urlpatterns = [
    path('body_weight/', views.WeightList.as_view()),
    path('body_weight/current/', views.CurrentWeightList.as_view()),
]