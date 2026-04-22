import { useEffect, useMemo, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import Chart from "../../components/Chart";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Dashboard.module.css"
import DailyTotal from "../../components/DailyTotal";
import CalorieProgress from "../../components/CalorieProgress";

function Dashboard() {
  const currentUser = useCurrentUser();
  const [calorieData, setCalorieData] = useState(null);
  const [currentWeightData, setCurrentWeightData] = useState([]);
  const [weightData, setWeightData] = useState([])


    
  useEffect(() => {
    if (!currentUser) return;
    const handleMount = async () => {
      try {
        const [ Weight, Current, Calorie] = await Promise.all([
          axiosReq.get("/body_weight/"),
          axiosReq.get("/body_weight/current/"),
          axiosReq.get("/daily-calorie-goal/today"),
        ]);
        setWeightData(Weight.data)
        setCurrentWeightData(Current.data);
        setCalorieData(Calorie.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [currentUser]);


  const chartData = useMemo(() => {
    const bodyWeight = weightData[0];
    if (!bodyWeight || !currentWeightData.length) return [];
    const GOAL_WEEKS = 12;
    const startWeight = Number(bodyWeight.starting_weight);
    const goalWeight = Number(bodyWeight.goal_weight);
    const sortedEntries = [...currentWeightData].sort(
      (oldest, newest) => new Date(oldest.created_at) - new Date(newest.created_at) 
    );
    const startDate = new Date(sortedEntries[0].created_at);
    const targetEndDate = new Date(startDate);
    targetEndDate.setDate(
      targetEndDate.getDate() + GOAL_WEEKS * 7
    );

    const totalTime = targetEndDate - startDate;
    return sortedEntries.map((entry) => {
      const entryDate = new Date(entry.created_at);
      let progress = totalTime <= 0 ? 1 : (entryDate - startDate) / totalTime;
      progress = Math.max(0, Math.min(1, progress));
      const targetWeight = startWeight + (goalWeight - startWeight) * progress;
      
      return {
        date: entry.created_at,
        current_weight: Number(entry.current_weight),
        target_weight: Number(targetWeight.toFixed(2)),
      }
    })
  }, [weightData, currentWeightData]);


    if (currentWeightData.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <Container className={`${styles.dashboard}`}>
      <Row>
        <Col>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div>
              <DailyTotal/>
            </div>
          </Card>
        </Col>

        <Col>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div>
              <Chart data={chartData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div>
              <p>Daily Calories: {calorieData?.calorie_goal}</p>
              <CalorieProgress calorieGoal={calorieData?.calorie_goal}/>
            </div>
          </Card>
        </Col>
        <Col>
        <Card className={`p-3 h-100 ${styles.card}`}>
          <Nav>
    
          <NavLink exact to="/currentbodyweight"><button type="button" className="btn btn-outline-primary">Log Weight</button></NavLink>
          <NavLink exact to="/meallog">
          <button type="button" className="btn btn-outline-primary ml-3 mr-3 ">Log Meals</button>
          </NavLink>

       
          </Nav>
        </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
