from rest_framework import serializers
from body_weight.models import BodyWeight, BodyWeightTracker


class BodyWeightSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    class Meta:
        model = BodyWeight
        fields = '__all__'


class BodyWeightTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyWeightTracker
        feilds = '--all--'
