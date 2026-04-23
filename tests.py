from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from body_weight.models import BodyWeight, BodyWeightTracker
from nutrition.models import Food, MealEntry, DailyCalorieGoal


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            password="pass123"
        )
        self.other_user = User.objects.create_user(
            username="user2",
            password="pass123"
        )

        self.client.login(username="user1", password="pass123")


class BodyWeightTests(BaseAPITestCase):
    def test_create_body_weight(self):
        response = self.client.post("/api/body_weight/", {
            "starting_weight": "95.00",
            "goal_weight": "80.00",
            "weight_unit": "kg",
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BodyWeight.objects.count(), 1)
        self.assertEqual(BodyWeight.objects.first().owner, self.user)

    def test_update_body_weight(self):
        body_weight = BodyWeight.objects.create(
            owner=self.user,
            starting_weight="95.00",
            goal_weight="80.00",
            weight_unit="kg",
        )

        response = self.client.put(f"/api/body_weight/{body_weight.id}/", {
            "starting_weight": "94.00",
            "goal_weight": "78.00",
            "weight_unit": "kg",
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body_weight.refresh_from_db()
        self.assertEqual(str(body_weight.starting_weight), "94.00")
        self.assertEqual(str(body_weight.goal_weight), "78.00")

    def test_user_cannot_update_another_users_body_weight(self):
        other_body_weight = BodyWeight.objects.create(
            owner=self.other_user,
            starting_weight="100.00",
            goal_weight="90.00",
            weight_unit="kg",
        )

        response = self.client.put(f"/api/body_weight/{other_body_weight.id}/", {
            "starting_weight": "90.00",
            "goal_weight": "85.00",
            "weight_unit": "kg",
        }, format="json")

        self.assertIn(response.status_code, [status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN])

    def test_create_current_weight_entry(self):
        BodyWeight.objects.create(
            owner=self.user,
            starting_weight="95.00",
            goal_weight="80.00",
            weight_unit="kg",
        )

        response = self.client.post("/api/body_weight/current/", {
            "current_weight": "92.50",
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BodyWeightTracker.objects.count(), 1)
        self.assertEqual(str(BodyWeightTracker.objects.first().current_weight), "92.50")


class NutritionTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.food = Food.objects.create(
            owner=self.user,
            name="Chicken Breast",
            serving_size="100.00",
            serving_unit="g",
            calories=165,
            protein="31.00",
            carbs="0.00",
            fat="3.60",
        )

    def test_create_food(self):
        response = self.client.post("/api/food/", {
            "name": "Rice",
            "serving_size": "100.00",
            "serving_unit": "g",
            "calories": 130,
            "protein": "2.70",
            "carbs": "28.00",
            "fat": "0.30",
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Food.objects.filter(owner=self.user).count(), 2)

    def test_create_meal_entry(self):
        response = self.client.post("/api/meal-entry/", {
            "food": self.food.id,
            "meal_type": "lunch",
            "quantity": "2.00",
            "consumed_at": "2026-04-22T12:00:00Z",
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MealEntry.objects.count(), 1)

        meal = MealEntry.objects.first()
        self.assertEqual(meal.owner, self.user)
        self.assertEqual(meal.food, self.food)

    def test_list_meal_entries_by_date(self):
        MealEntry.objects.create(
            owner=self.user,
            food=self.food,
            meal_type="lunch",
            quantity="1.00",
            consumed_at="2026-04-22T12:00:00Z",
        )
        MealEntry.objects.create(
            owner=self.user,
            food=self.food,
            meal_type="dinner",
            quantity="1.00",
            consumed_at="2026-04-23T12:00:00Z",
        )

        response = self.client.get("/api/meal-entry/?date=2026-04-22")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_meal_entry(self):
        meal = MealEntry.objects.create(
            owner=self.user,
            food=self.food,
            meal_type="lunch",
            quantity="1.00",
            consumed_at="2026-04-22T12:00:00Z",
        )

        response = self.client.delete(f"/api/meal-entry/{meal.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(MealEntry.objects.count(), 0)

    def test_today_calorie_goal_creates_default_goal(self):
        response = self.client.get("/api/daily-calorie-goal/today/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["calorie_goal"], 2000)
        self.assertEqual(DailyCalorieGoal.objects.count(), 1)

    def test_today_calorie_goal_can_be_updated(self):
        response = self.client.put("/api/daily-calorie-goal/today/", {
            "calorie_goal": 2300
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["calorie_goal"], 2300)