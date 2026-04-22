import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  Alert,
} from "react-bootstrap";
import useMealEntries from "../../hooks/useMealEntries.js";
import useFoods from "../../hooks/useFoods";
import { axiosReq } from "../../api/axiosDefaults";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min.js";
import styles from "../../App.module.css";

function MealLog() {
  const today = new Date().toISOString().split("T")[0];
  
  // The date being viewed in the meal log
  const [selectedDate, setSelectedDate] = useState(today);

  // Success/error messages for meal submission.
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  
   // All foods available to choose from in the dropdown
  const { foods, loading: foodsLoading } = useFoods();

  // All meal entries for the selected date
  const {
    entries,
    setEntries,
    loading: entriesLoading,
  } = useMealEntries(selectedDate);
  
   // Form state for the meal-entry form
  const [formData, setFormData] = useState({
    food: "",
    meal_type: "breakfast",
    quantity: "1",
    consumed_at: new Date().toISOString().slice(0, 16),
  });

  const { food, meal_type, quantity, consumed_at } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setSubmitError("");

    
    try {
      const payload = {
        food: parseInt(food, 10),
        meal_type,
        quantity: parseFloat(quantity),
        consumed_at,
      };

      // Creates a new meal entry
      const { data } = await axiosReq.post("/meal-entry/", payload);

      // Only insert the new entry into the current list if its date matches
      // the date the user is currently viewing
      const entryDate = new Date(data.consumed_at).toISOString().split("T")[0];
      if (entryDate === selectedDate) {
        setEntries((prev) => [data, ...prev]);
      }

      // Reset the form after successful submission.
      setFormData({
        food: "",
        meal_type: "breakfast",
        quantity: "1",
        consumed_at: new Date().toISOString().slice(0, 16),
      });

      setSuccess("Meal added successfully.");
    } catch (error) {
      console.log(error.response?.data || error);
      setSubmitError("Could not save meal.");
    }
  };

  // Handles delete on selected meal entry
  const handleDelete = async (entryId) => {
    try {
      await axiosReq.delete(`/meal-entry/${entryId}`);
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  // Split entries into sections for separate breakfast/lunch/dinner/snack tables
  const groupedMeals = useMemo(() => {
    return {
      breakfast: entries.filter((entry) => entry.meal_type === "breakfast"),
      lunch: entries.filter((entry) => entry.meal_type === "lunch"),
      dinner: entries.filter((entry) => entry.meal_type === "dinner"),
      snack: entries.filter((entry) => entry.meal_type === "snack"),
    };
  }, [entries]);

  // Daily nutrition totals for the selected date
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.calories += Number(entry.total_calories || 0);
        acc.protein += Number(entry.total_protein || 0);
        acc.carbs += Number(entry.total_carbs || 0);
        acc.fat += Number(entry.total_fat || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [entries]);

  const renderMealSection = (title, mealEntries) => (
    <Card className={`mb-3 ${styles.card}`}>
      <Card.Body>
        <h4>{title}</h4>
        {mealEntries.length === 0 ? (
          <p>No items logged.</p>
        ) : (
          <Table responsive striped bordered>
            <thead>
              <tr>
                <th>Food</th>
                <th>Qty</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
              </tr>
            </thead>
            <tbody>
              {mealEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.food_name}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.total_calories}</td>
                  <td>{entry.total_protein}</td>
                  <td>{entry.total_carbs}</td>
                  <td>{entry.total_fat}</td>
                  <td>
                    {" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col md={8}>
          <Card className={`p-3 ${styles.card}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Meal Log</h2>
              <NavLink to="/createfood">
                <Button>Create New Food</Button>
              </NavLink>
            </div>
            {success && <Alert variant="success">{success}</Alert>}
            {submitError && <Alert variant="danger">{submitError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="food">
                <Form.Label>Food</Form.Label>
                <Form.Control
                  as="select"
                  name="food"
                  value={food}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select food</option>
                  {foods.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.serving_size} {item.serving_unit})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="meal_type">
                <Form.Label>Meal Type</Form.Label>
                <Form.Control
                  as="select"
                  name="meal_type"
                  value={meal_type}
                  onChange={handleChange}
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="consumed_at">
                <Form.Label>Consumed At</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="consumed_at"
                  value={consumed_at}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={foodsLoading}>
                Add to Log
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={4}>
          <Card className={`p-3 ${styles.card}`}>
            <h3>Daily Totals</h3>
            <Form.Group className="mb-3" controlId="selectedDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>

            <p>
              <strong>Calories:</strong> {totals.calories.toFixed(2)}
            </p>
            <p>
              <strong>Protein:</strong> {totals.protein.toFixed(2)}g
            </p>
            <p>
              <strong>Carbs:</strong> {totals.carbs.toFixed(2)}g
            </p>
            <p>
              <strong>Fat:</strong> {totals.fat.toFixed(2)}g
            </p>
          </Card>
        </Col>
      </Row>

      {entriesLoading ? (
        <p>Loading meals...</p>
      ) : (
        <>
          {renderMealSection("Breakfast", groupedMeals.breakfast)}
          {renderMealSection("Lunch", groupedMeals.lunch)}
          {renderMealSection("Dinner", groupedMeals.dinner)}
          {renderMealSection("Snack", groupedMeals.snack)}
        </>
      )}
    </Container>
  );
}

export default MealLog;
