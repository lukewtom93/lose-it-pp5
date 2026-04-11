from rest_framework import permissions
from drf_api.permissions import IsOwnerOrReadOnly
from rest_framework import generics
from .models import BodyWeight, BodyWeightTracker
from .serializer import BodyWeightSerializer, BodyWeightTrackerSerializer


class WeightList(generics.ListCreateAPIView):
    serializer_class = BodyWeightSerializer
    queryset = BodyWeight.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CurrentWeightList(generics.ListCreateAPIView):
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