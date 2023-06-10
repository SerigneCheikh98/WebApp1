import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { getGuess } from './API';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [guess, setGuess] = useState(100);

  const newGuess = async () => {
    try {
      const n = await getGuess();
      setGuess(n);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Container>
      <Row>
        <h1>App</h1>
      </Row>
      <Row>
        <Col><Button onClick={newGuess}>Guess a number</Button></Col>
        <Col>{guess}</Col>
      </Row>
    </Container>
  )
}

export default App
