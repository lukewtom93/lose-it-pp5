from rest_framework import permissions
from rest_framework import generics
from .models import BodyWeight, BodyWeightTracker
from .serializer import BodyWeightSerializer, BodyWeightTrackerSerializer


class WeightList(generics.ListCreateAPIView):
    serializer_class = BodyWeightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeight.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CurrentWeightList(generics.ListAPIView):
    serializer_class = BodyWeightTrackerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeightTracker.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)