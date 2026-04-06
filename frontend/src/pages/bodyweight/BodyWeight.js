import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";

function BodyWeight() {
    const [bodyWeight, setBodyWeight] = useState(null);

    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await axiosReq.get(
                    '/body_weight/'
                );
                
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
        {/* <div class="input-group mb-3">
          <div class="input-group-prepend">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item">
                Action
              </a>
              <a class="dropdown-item" href="#">
                Another action
              </a>
              <a class="dropdown-item" href="#">
                Something else here
              </a>
              <div role="separator" class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">
                Separated link
              </a>
            </div>
          </div>
          <input
            type="text"
            class="form-control"
            aria-label="Text input with dropdown button"
          />
        </div> */}
        <div>
            <p>Starting: {bodyWeight?.starting_weight} {bodyWeight?.weight_unit}</p>
            <p>Goal: {bodyWeight?.goal_weight} {bodyWeight?.weight_unit}</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BodyWeight;
