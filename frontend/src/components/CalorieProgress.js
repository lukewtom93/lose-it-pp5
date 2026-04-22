import { useMemo } from 'react'
import { ProgressBar } from 'react-bootstrap';
import useMealEntries from '../hooks/useMealEntries';

const CalorieProgress = ({calorieGoal, selectedDate}) => {
  // Use the same selected date that Dashboard passes to DailyTotal
  const { entries = [] } = useMealEntries(selectedDate);

  // Only total the calorie field for the progress bar
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.calories += Number(entry.total_calories || 0);

        return acc;
      },
      { calories: 0 },
    );
  }, [entries]);

  // Convert the prop to a number
  const number = Number(calorieGoal)

  // ProgressBar expects a percentage, not raw calories
  const progress = (totals.calories / number) * 100;
  
  return (
    <ProgressBar 
    now={progress}
    variant={progress > 100 ? "danger" : "success"}
    label={`${progress.toFixed(0)}%`}
    />
  )
}

export default CalorieProgress