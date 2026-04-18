import { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container } from "react-bootstrap";
import Chart from "../../components/Chart";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function Dashboard() {
  const currentUser = useCurrentUser();
  const [currentWeightData, setCurrentWeightData] = useState([]);
  const [bodyWeightData, setBodyWeightData] = useState({
    starting_weight: "",
    goal_weight: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    const handleMount = async () => {
      try {
        const [Weight, Current] = await Promise.all([
          axiosReq.get("/body_weight/"),
          axiosReq.get("/body_weight/current/"),
        ]);

        setBodyWeightData(Weight.data[0]);
        setCurrentWeightData(Current.data);
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
    <Container>
      <Row>
        <Col>
          <Card className="p-3 h-100">
            <div>
              <p>
                Starting: {bodyWeightData?.starting_weight}{" "}
                {bodyWeightData?.weight_unit}
              </p>
              <p>
                Goal: {bodyWeightData?.goal_weight}{" "}
                {bodyWeightData?.weight_unit}
              </p>
            </div>
          </Card>
        </Col>

        <Col>
          <Card className="p-3 h-100">
            <div>
              <Chart data={currentWeightData} />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
