from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializes profile data for API responses,
    including ownership and related body weight values.
    """

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    is_owner = serializers.SerializerMethodField()

    starting_weight = serializers.ReadOnlyField(
        source="owner.profile.starting_weight"
    )

    goal_weight = serializers.ReadOnlyField(
        source="owner.profile.goal_weight"
    )

    def get_is_owner(self, obj):
        """
        Returns True if current user owns this profile.
        """
        request = self.context["request"]
        return request.user == obj.owner

    class Meta:
        """
        Use all model fields in serialized output.
        """
        model = Profile
        fields = "__all__"