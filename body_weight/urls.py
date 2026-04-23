from django.urls import path
from body_weight import views

urlpatterns = [
    path('body_weight/', views.BodyWeightList.as_view()),
    path('body_weight/<int:pk>/', views.BodyWeightDetail.as_view()),
    path('body_weight/current/', views.CurrentWeightList.as_view()),
]