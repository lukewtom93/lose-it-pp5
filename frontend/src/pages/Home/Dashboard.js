import { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults'
import { Row, Col, Card } from "react-bootstrap";
import Chart from "../../components/Chart";

function Dashboard() {
  const [currentWeightData, setCurrentWeightData] = useState([]);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/body_weight/current/");

        setCurrentWeightData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, []);

  if (currentWeightData.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <Row>
      <Col>
        <Card>
          <div>
            <Chart data={currentWeightData} />
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default Dashboard;
