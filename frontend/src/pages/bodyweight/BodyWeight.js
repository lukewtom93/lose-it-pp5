import React, { useEffect, useState } from "react";
import { Card, Dropdown, Form } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";



function BodyWeight() {

  const [bodyWeightData, setBodyWeightData] = useState({
    starting_weight: "",
    goal_weight: "",
  });
  const { starting_weight, goal_weight } = bodyWeightData;
  const [unit, setUnit] = useState("kg");
  const unitChoices = [
    { value: "kg", label: "Kilograms" },
    { value: "lb", label: "Pounds" },
    { value: "st", label: "Stone" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosReq.post(
        "/body_weight/",
        bodyWeightData,
      );
      setBodyWeightData(data);
      console.log(data);
    } catch (error) {
      console.log(error.respose || error);
    }
  };

  const handleChange = (event) => {
    setBodyWeightData({
      ...bodyWeightData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/body_weight/");
        setUnit(data[0].weight_unit);
        console.log(data);
        setBodyWeightData(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="starting_weight">
            <Form.Label className="d-none">Starting Weight</Form.Label>
            <Form.Control
              type="text"
              placeholder="Starting Weight"
              name="starting_weight"
              value={starting_weight}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="goal_weight">
            <Form.Label className="d-none">Goal Weight</Form.Label>
            <Form.Control
              type="text"
              placeholder="Goal Weight"
              name="goal_weight"
              value={goal_weight}
              onChange={handleChange}
            />
          </Form.Group>
          <button type="submit">submit</button>
        </Form>
        <Dropdown>
          <Dropdown.Toggle>{unit}</Dropdown.Toggle>
          <Dropdown.Menu>
            {unitChoices.map((choice) => (
              <Dropdown.Item
                key={choice.value}
                onClick={() => {
                  setUnit(choice.value);
                  setBodyWeightData({
                    ...bodyWeightData,
                    weight_unit: choice.value,
                  });
                }}
              >
                {choice.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <div className="input-group mb-3">
          <div className="input-group-prepend"></div>
          <input
            type="text"
            className="form-control"
            aria-label="Text input with dropdown button"
          />
        </div>
        <div>
          <p>
            Starting: {bodyWeightData?.starting_weight}{" "}
            {bodyWeightData?.weight_unit}
          </p>
          <p>
            Goal: {bodyWeightData?.goal_weight} {bodyWeightData?.weight_unit}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BodyWeight;
