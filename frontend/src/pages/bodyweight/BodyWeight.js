import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";

function BodyWeight() {
    const [bodyWeight, setBodyWeight] = useState(null);
    const [unit, setUnit] = useState('kg');
    const unitChoices = [
            { value: "kg", label: "Kilograms" },
            { value: "lb", label: "Pounds" },
            { value: "st", label: "Stone" },
    ];

    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await axiosReq.get(
                    '/body_weight/'
                );
                setUnit(data[0].weight_unit);
                console.log(data)
                setBodyWeight(data[0]);
  
            } catch (error) {
                console.log(error)
            }
        };
        handleMount();
    }, []);



  return (
    <Card>
        <Card.Body>
            <Dropdown>
                <Dropdown.Toggle>
                    {unit}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {unitChoices.map((choice) => (
                    <Dropdown.Item key={choice.value} onClick={() => setUnit(choice.value)}>
                        {choice.label}
                    </Dropdown.Item>
                    ))};
                </Dropdown.Menu>
            </Dropdown>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                </div>
                <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with dropdown button"
                />
            </div>
            <div>
                <p>Starting: {bodyWeight?.starting_weight} {bodyWeight?.weight_unit}</p>
                <p>Goal: {bodyWeight?.goal_weight} {bodyWeight?.weight_unit}</p>
            </div>
        </Card.Body>
    </Card>
  );
}

export default BodyWeight;
