from rest_framework import serializers
from body_weight.models import BodyWeight, BodyWeightTracker


class BodyWeightSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField(read_only=True)
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')

    class Meta:
        model = BodyWeight
        fields = '__all__'

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.owner == request.user if request else False
    
    def create(self, validated_data):
        user = self.context['request'].user
        obj, _ = BodyWeight.objects.update_or_create(
            owner=user,
            defaults=validated_data
        )
        return obj


class BodyWeightTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyWeightTracker
        fields = '__all__'
