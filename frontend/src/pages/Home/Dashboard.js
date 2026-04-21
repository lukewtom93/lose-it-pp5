import { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import Chart from "../../components/Chart";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Dashboard.module.css"
import DailyTotal from "../../components/DailyTotal";

function Dashboard() {
  const currentUser = useCurrentUser();
  const [calorieData, setCalorieData] = useState(null);
  const [currentWeightData, setCurrentWeightData] = useState([]);


    
  useEffect(() => {
    if (!currentUser) return;
    const handleMount = async () => {
      try {
        const [Weight, Current, Calorie] = await Promise.all([
          axiosReq.get("/body_weight/"),
          axiosReq.get("/body_weight/current/"),
          axiosReq.get("/daily-calorie-goal/today"),
        ]);

        setCurrentWeightData(Current.data);
        setCalorieData(Calorie.data);
        console.log(Weight.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [currentUser]);

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
              <Chart data={currentWeightData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className={`p-3 h-100 ${styles.card}`}>
            <div>
              <p>Daily Calories: {calorieData?.calorie_goal}</p>
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
