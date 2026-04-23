import { useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Row, Col, Card, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CurrentBodyWeight() {
  // Stores the created weight entry array
  const [currentWeightData, setCurrentWeightData] = useState([]);

  // stores current weight
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
      // Sends only the new current-weight value
      const { data } = await axiosReq.post(
        "/body_weight/current/",{
       current_weight: parseFloat(current_weight),
    });
      // Add the new entry to local state so the UI can update
      setCurrentWeightData((prevData) => [...prevData, data]);

      // Clear the form after saving
      setFormData({current_weight: "" });

      // Send the user back to the dashboard
      history.push('/');

    } catch (error) {
      console.log(error);
    }
  };

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
