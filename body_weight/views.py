from rest_framework import permissions
from rest_framework import generics
from .models import BodyWeight, BodyWeightTracker
from .serializer import BodyWeightSerializer, BodyWeightTrackerSerializer


class WeightList(generics.ListCreateAPIView):
    serializer_class = BodyWeightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BodyWeight.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CurrentWeightList(generics.ListAPIView):
    serializer_class = BodyWeightTrackerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeightTracker.objects.all()

    def get_queryset(self):
        return BodyWeightTracker.objects.filter(
            body_weight__owner=self.request.user
        )

    def perform_create(self, serializer):
        body_weight = BodyWeight.objects.get(owner=self.request.user)
        serializer.save(body_weight=body_weight)