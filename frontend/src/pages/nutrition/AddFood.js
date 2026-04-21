import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { axiosReq } from '../../api/axiosDefaults'
import useFoods from '../../hooks/useFoods';

function AddFood() {
    // const [foodData, setFoodData] = useState([])

    // useEffect (() => {
    //     const food = async () => {
    //         try {
    //             const {data} = await axiosReq.get('/food/')
    //             setFoodData(data);
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     food()
    // }, [])
    const { foods, loading, error } = useFoods();
    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

  return (
    <Container>
      <Row>
        <Col>
          <Card className="p-4">
            <h2>Your Foods</h2>

            {foods.length === 0 ? (
              <p>No foods created yet.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Serving</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id}>
                      <td>{food.name}</td>
                      <td>
                        {food.serving_size} {food.serving_unit}
                      </td>
                      <td>{food.calories}</td>
                      <td>{food.protein}</td>
                      <td>{food.carbs}</td>
                      <td>{food.fat}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default AddFood