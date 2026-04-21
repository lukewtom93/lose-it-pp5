import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { axiosReq } from '../../api/axiosDefaults'

function MealLog() {
    const [foods, setFoods] = useState([])
    const [formData, setFormData] = useState({
        food: "",
    })
    const { food } = formData

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosReq.post(
                "/food/",
                food
            )
            setFoods(data);
            setFormData({food: ""});
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Container>
        <Row>
            <Col>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='food'>
                        <Form.Label>Food</Form.Label> 
                        <Form.Control
                        name='food'
                        type='text'
                        value={food}
                        onChange={handleChange}
                        />                  
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Meal</Form.Label>                    
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>                    
                    </Form.Group>
                    <Button type='submit'>Save</Button>


                </Form>
            </Card>
            </Col>
        </Row>
    </Container>
  )
}

export default MealLog