import { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults'
import { Row, Col, Card } from 'react-bootstrap'


function CurrentBodyWeight() {

    const [currentWeightData, setCurrentWeightData] = useState([])

    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await (
                    axiosReq.get('/body_weight/current/'))
                
                setCurrentWeightData(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        };
        handleMount()
    }, []);

    if (!currentWeightData){
        return <p>Loading...</p>;
    }
  return (
    <Row>
        <Col>
            <Card>
                <div>
                    {currentWeightData.map((entry) => (
                        <div key={entry.id}>
                            {entry.current_weight} - {entry.created_at}
                        </div>
                    ))}
                </div>
            </Card>
        </Col>
    </Row>
  )
}

export default CurrentBodyWeight