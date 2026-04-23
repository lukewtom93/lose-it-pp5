from rest_framework import serializers
from body_weight.models import (
    BodyWeight,
    BodyWeightTracker,
)


class BodyWeightSerializer(serializers.ModelSerializer):
    """
    Serializes body weight profile data,
    including ownership checks.
    """

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    is_owner = serializers.SerializerMethodField(
        read_only=True
    )

    profile_id = serializers.ReadOnlyField(
        source="owner.profile.id"
    )

    class Meta:
        """
        Use all BodyWeight model fields.
        """
        model = BodyWeight
        fields = "__all__"

    def get_is_owner(self, obj):
        """
        Returns True if current user owns this record.
        """
        request = self.context.get("request")

        return (
            obj.owner == request.user
            if request else False
        )

    def create(self, validated_data):
        """
        Update existing body weight record if one exists,
        otherwise create a new one.
        Prevents duplicate profiles per user.
        """
        user = self.context["request"].user

        obj, _ = BodyWeight.objects.update_or_create(
            owner=user,
            defaults=validated_data
        )

        return obj


class BodyWeightTrackerSerializer(
    serializers.ModelSerializer
):
    """
    Serializes logged weigh-in entries used
    for progress tracking charts.
    """

    class Meta:
        """
        Fields returned for weight log entries.
        """
        model = BodyWeightTracker

        fields = [
            "current_weight",
            "created_at",
            "updated_at",
            "id",
        ]