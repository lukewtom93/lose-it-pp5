import { useEffect, useState } from "react";
import { Card, Container, Dropdown, Form, Row, Col, Alert, Button } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function BodyWeight() {
  const history = useHistory();

  const [bodyWeightData, setBodyWeightData] = useState({
    starting_weight: "",
    goal_weight: "",
    weight_unit: "kg",
  });

  const [bodyWeightId, setBodyWeightId] = useState(null);
  const [unit, setUnit] = useState("kg");
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  const { starting_weight, goal_weight } = bodyWeightData;

  const unitChoices = [
    { value: "kg", label: "Kilograms" },
    { value: "lb", label: "Pounds" },
    { value: "st", label: "Stone" },
  ];

  const handleChange = (event) => {
    setBodyWeightData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUnitSelect = (value) => {
    setUnit(value);
    setBodyWeightData((prev) => ({
      ...prev,
      weight_unit: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSuccess("");

    try {
      const payload = {
        starting_weight: parseFloat(starting_weight),
        goal_weight: parseFloat(goal_weight),
        weight_unit: unit,
      };

      let data;

      if (bodyWeightId) {
        // update existing body weight record
        const response = await axiosReq.put(`/body_weight/${bodyWeightId}`, payload);
        data = response.data;
        setSuccess("Body weight updated successfully.");
      } else {
        // create new body weight record
        const response = await axiosReq.post("/body_weight/", payload);
        data = response.data;
        setBodyWeightId(data.id);
        setSuccess("Body weight created successfully.");
      }

      setBodyWeightData({
        starting_weight: data.starting_weight,
        goal_weight: data.goal_weight,
        weight_unit: data.weight_unit,
      });
      setUnit(data.weight_unit);

      history.push("/");
    } catch (error) {
      console.log(error.response?.data || error);
      setSubmitError("Could not save body weight data.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/body_weight/");

        if (!isMounted) return;

        if (data.length > 0) {
          const existing = data[0];
          setBodyWeightId(existing.id);
          setUnit(existing.weight_unit || "kg");
          setBodyWeightData({
            starting_weight: existing.starting_weight || "",
            goal_weight: existing.goal_weight || "",
            weight_unit: existing.weight_unit || "kg",
          });
        }
      } catch (error) {
        console.log(error.response?.data || error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    handleMount();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-3">
            <Card.Body>
              <h2 className="mb-3">
                {bodyWeightId ? "Edit Body Weight Goals" : "Set Body Weight Goals"}
              </h2>

              {success && <Alert variant="success">{success}</Alert>}
              {submitError && <Alert variant="danger">{submitError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="starting_weight" className="mb-3">
                  <Form.Label>Starting Weight</Form.Label>

                  <div className="input-group">
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Starting Weight"
                      name="starting_weight"
                      value={starting_weight}
                      onChange={handleChange}
                      required
                    />

                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary">
                        {unit}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {unitChoices.map((choice) => (
                          <Dropdown.Item
                            key={choice.value}
                            onClick={() => handleUnitSelect(choice.value)}
                          >
                            {choice.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Form.Group>

                <Form.Group controlId="goal_weight" className="mb-3">
                  <Form.Label>Goal Weight</Form.Label>

                  <div className="input-group">
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Goal Weight"
                      name="goal_weight"
                      value={goal_weight}
                      onChange={handleChange}
                      required
                    />

                    <div className="input-group-text">{unit}</div>
                  </div>
                </Form.Group>

                <Button type="submit" className="mt-2">
                  {bodyWeightId ? "Update Goals" : "Save Goals"}
                </Button>
              </Form>

              <div className="mt-4">
                <p>
                  <strong>Starting:</strong> {bodyWeightData?.starting_weight}{" "}
                  {bodyWeightData?.weight_unit || unit}
                </p>
                <p>
                  <strong>Goal:</strong> {bodyWeightData?.goal_weight}{" "}
                  {bodyWeightData?.weight_unit || unit}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BodyWeight;