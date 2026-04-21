import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";

function CreateFood() {
  const [formData, setFormData] = useState({
    name: "",
    serving_size: "",
    serving_unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const unitChoices = [
    { value: "g", label: "Grams" },
    { value: "ml", label: "Millileters" },
    { value: "each", label: "each" },
    { value: "slice", label: "slice" },
  ];

  const { name, serving_size, serving_unit, calories, protein, carbs, fat } =
    formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
       await axiosReq.post("/food/", formData);

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
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="serving_size">
                <Form.Label>Serving Size</Form.Label>
                <Form.Control
                  name="serving_size"
                  type="number"
                  value={serving_size}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="serving_unit">
                <Form.Label>Serving Unit</Form.Label>
            
                <Dropdown value={serving_unit} onChange={handleChange} name="serving_unit">
                <Dropdown.Toggle >
                    {serving_unit}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                        {unitChoices.map((choice) => (
                          <Dropdown.Item
                            key={choice.value}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                serving_unit: choice.value
                              }));

                            }}
                          >
                            {choice.label}
                          </Dropdown.Item>
                        ))}
                </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group controlId="calories">
                <Form.Label>calories</Form.Label>
                <Form.Control
                  name="calories"
                  type="text"
                  value={calories}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="protein">
                <Form.Label>protein</Form.Label>
                <Form.Control
                  name="protein"
                  type="text"
                  value={protein}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="carbs">
                <Form.Label>carbs</Form.Label>
                <Form.Control
                  name="carbs"
                  type="text"
                  value={carbs}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="fat">
                <Form.Label>fat</Form.Label>
                <Form.Control
                  name="fat"
                  type="text"
                  value={fat}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit">Save</Button>
            </Form>
          </Card>
          <div>{formData?.food}</div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateFood;
