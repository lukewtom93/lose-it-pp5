from rest_framework import permissions
from rest_framework import generics
from .models import BodyWeight
from .serializer import BodyWeightSerializer


class WeightList(generics.ListCreateAPIView):
    serializer_class = BodyWeightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = BodyWeight.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)