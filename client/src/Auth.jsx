/* eslint-disable react/prop-types */
import { Button, Form, Toast, Row, Col, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginForm(props) {

    const [username, setUsername] = useState('') ;
    const [password, setPassword] = useState('') ;
    const [ErrorMsg, setErrorMsg] = useState('') ;

    const navigate = useNavigate() ;

    const handleLogin = async () => {
        try {
            setErrorMsg('') ;
            await props.doLogin(username, password) ;
            navigate('/') ;
        } catch(err) {
            setErrorMsg(err.message);
        }
    }

    return <div className="login-form-container">
        <Row className="vh-100 justify-content-md-center">
        <Col md={4} >
        <h2 className="form-title">Sign in</h2>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type='text' placeholder='username' value={username} style={{ width: '18rem' }} onChange={(event) => { setUsername(event.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='password' value={password} style={{ width: '18rem' }} onChange={(event) => { setPassword(event.target.value) }} />
            </Form.Group >
            <Stack gap={2} className="col-md-6 mx-auto" >
                <Button variant="success" type="button" size="lg" onClick={handleLogin}>Login</Button>{' '}
                <Button variant="secondary" type="button" size="lg" onClick={() => { navigate('/') }}>Back</Button><br />
            </Stack>
            {/* <Button variant="primary" type="button" onClick={handleLogin}>Login</Button>{' '}
            <Button variant="secondary" type="button" onClick={() => { navigate('/') }}>Back</Button><br /> */}
            <Toast show={ErrorMsg !== ''} onClose={() => setErrorMsg('')} delay={4000} autohide bg="danger">
                <Toast.Body>{ErrorMsg}</Toast.Body>
            </Toast>
        </Form>
        </Col>
      </Row>
    </div>

}

export { LoginForm } ;