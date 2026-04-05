from rest_framework import permissions
from rest_framework import generics
from .models import BodyWeight, BodyWeightTracker
from .serializer import BodyWeightSerializer, BodyWeightTrackerSerializer


class WeightList(generics.ListCreateAPIView):
    serializer_class = BodyWeightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeight.objects.all()

    def perform_create(self, serializer):
        obj, created = BodyWeight.objects.get_or_create(
            owner=self.request.user,
            defaults=serializer.validated_data
        )

        if not created:
            # update instead of creating new
            for attr, value in serializer.validated_data.items():
                setattr(obj, attr, value)
            obj.save()
        return obj


class CurrentWeightList(generics.ListAPIView):
    serializer_class = BodyWeightTrackerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeightTracker.objects.all()

    def get_queryset(self):
        return BodyWeightTracker.objects.filter(
            owner__owner=self.request.user
        )

    def perform_create(self, serializer):
        owner = BodyWeight.objects.get(owner=self.request.user)
        serializer.save(owner=owner)