import { useEffect, useMemo, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import Chart from "../../components/Chart";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Dashboard.module.css";
import DailyTotal from "../../components/DailyTotal";
import CalorieProgress from "../../components/CalorieProgress";

function Dashboard() {
  const currentUser = useCurrentUser();

  // Daily calorie goal for the backend
  const [calorieData, setCalorieData] = useState(null);

  // Logged body-weight entries over time.
  const [currentWeightData, setCurrentWeightData] = useState([]);

  // Holds the main body-weight profile with starting_weight + goal_weight
  const [weightData, setWeightData] = useState([]);

  // The shared date state for DailyTotal and CalorieProgress
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    // Checks if user exists
    if (!currentUser) return;

    const handleMount = async () => {
      try {
        // Fetch all needed dashboard data
        const [Weight, Current, Calorie] = await Promise.all([
          axiosReq.get("/body_weight/"),
          axiosReq.get("/body_weight/current/"),
          axiosReq.get("/daily-calorie-goal/today/"),
        ]);
        setWeightData(Weight.data);
        setCurrentWeightData(Current.data);
        setCalorieData(Calorie.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [currentUser]);

  // Chart data with current weight and target weight over time
  const chartData = useMemo(() => {
    const bodyWeight = weightData[0];

    // If there is no profile or no log entry theres nothong to plot
    if (!bodyWeight || !currentWeightData.length) return [];

    // This controls how long the goal target is
    const GOAL_WEEKS = 12;

    const startWeight = Number(bodyWeight.starting_weight);
    const goalWeight = Number(bodyWeight.goal_weight);

    // Sorts weights from oldest to newest for chart data
    const sortedEntries = [...currentWeightData].sort(
      (oldest, newest) =>
        new Date(oldest.created_at) - new Date(newest.created_at),
    );

    // the target is set on the first weight log
    const startDate = new Date(sortedEntries[0].created_at);

    // Sets date for end goal
    const targetEndDate = new Date(startDate);
    targetEndDate.setDate(targetEndDate.getDate() + GOAL_WEEKS * 7);

    const totalTime = targetEndDate - startDate;
    return sortedEntries.map((entry) => {
      const entryDate = new Date(entry.created_at);

      // Target end date is calculated from how far between 0 and 1 is
      let progress = totalTime <= 0 ? 1 : (entryDate - startDate) / totalTime;

      // stops progress from going above 1 or below 0
      progress = Math.max(0, Math.min(1, progress));

      // creating line for the data points
      const targetWeight = startWeight + (goalWeight - startWeight) * progress;

      return {
        // date for the Chart component
        date: entry.created_at,

        // Value data for the backend
        current_weight: Number(entry.current_weight),

        // Data for the path of the target weight data points
        target_weight: Number(targetWeight.toFixed(2)),
      };
    });
  }, [weightData, currentWeightData]);

  return (
    <Container className={`${styles.dashboard}`}>
      <Row>
        <Col md={6}>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div className={styles.section}>
              <DailyTotal
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div className={styles.section}>
              <p className={styles.calorieGoal}>
                Daily Calories: {calorieData?.calorie_goal}
              </p>
              <CalorieProgress
                calorieGoal={calorieData?.calorie_goal}
                selectedDate={selectedDate}
              />
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div className={styles.chartWrap}>
              <Chart data={chartData} />
            </div>
            <div className={styles.button}>
              <Nav>
                <NavLink exact to="/currentbodyweight">
                  <button type="button" className="btn btn-outline-primary ml-3 mr-3">
                    Log Weight
                  </button>
                </NavLink>
                <NavLink exact to="/meallog">
                  <button type="button" className="btn btn-outline-primary ml-3 mr-3">
                    Log Meals
                  </button>
                </NavLink>
              </Nav>
              <NavLink exact to="/bodyweight">
                <button
                  type="button"
                  className="btn btn-outline-primary ml-3 mr-3"
                >
                  Edit Goals
                </button>
              </NavLink>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
