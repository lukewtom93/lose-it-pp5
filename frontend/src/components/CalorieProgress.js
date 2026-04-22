import { useMemo } from 'react'
import { ProgressBar } from 'react-bootstrap';
import useMealEntries from '../hooks/useMealEntries';

const CalorieProgress = ({calorieGoal, selectedDate}) => {
  const { entries = [] } = useMealEntries(selectedDate);
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.calories += Number(entry.total_calories || 0);

        return acc;
      },
      { calories: 0 },
    );
  }, [entries]);
  const number = Number(calorieGoal)
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