import { useMemo } from "react";
import { Form } from "react-bootstrap";
import useMealEntries from "../hooks/useMealEntries";


const DailyTotal = ({ selectedDate, setSelectedDate}) => {

  const { entries } = useMealEntries(selectedDate)
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
  return (

     
        <div>
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

        </div>
     

  );
};

export default DailyTotal;
