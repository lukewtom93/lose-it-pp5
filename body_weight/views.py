from rest_framework import permissions
from rest_framework import generics
from .models import BodyWeight, BodyWeightTracker
from .serializer import BodyWeightSerializer, BodyWeightTrackerSerializer


class BodyWeightList(generics.ListCreateAPIView):
    """
    Lists the authenticated user's body weight profile
    and allows a new one to be created.
    """

    serializer_class = BodyWeightSerializer
    queryset = BodyWeight.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restrict results to the logged-in user's data.
        """
        return self.queryset.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):
        """
        Automatically assign ownership to current user.
        """
        serializer.save(owner=self.request.user)


class BodyWeightDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates or deletes a single body weight record.
    """

    serializer_class = BodyWeightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Prevent access to records belonging to other users.
        """
        return BodyWeight.objects.filter(
            owner=self.request.user
        )


class CurrentWeightList(generics.ListCreateAPIView):
    """
    Lists body weight tracker entries and allows
    users to log new weigh-ins.
    """

    serializer_class = BodyWeightTrackerSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = BodyWeightTracker.objects.all()

    def get_queryset(self):
        """
        Return weigh-in history ordered oldest to newest
        for chart plotting.
        """
        return BodyWeightTracker.objects.filter(
            body_weight__owner=self.request.user
        ).order_by("created_at")

    def perform_create(self, serializer):
        """
        Attach a new weigh-in to the user's body weight profile.
        """
        body_weight = BodyWeight.objects.get(
            owner=self.request.user
        )

        serializer.save(body_weight=body_weight)