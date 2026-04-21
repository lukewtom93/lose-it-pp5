import { useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CurrentBodyWeight() {
  const [currentWeightData, setCurrentWeightData] = useState([]);
  const [formData, setFormData] = useState({
    current_weight: "",
  });
  const { current_weight } = formData;
  const history = useHistory();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axiosReq.post(
        "/body_weight/current/",{
       current_weight: parseFloat(current_weight),
    });
      setCurrentWeightData((prevData) => [...prevData, data]);
      setFormData({current_weight: "" });
      history.push('/');

    } catch (error) {
      console.log(error);
    }
  };


  if (!currentWeightData) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="current-weight">
                <Form.Label>Log Todays Weight</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Log Weight"
                  name="current_weight"
                  value={current_weight}
                  onChange={handleChange}
                />
              </Form.Group>
              <button className="btn btn-outline-primary ml-3 mr-3 ">
                Save
              </button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CurrentBodyWeight;
