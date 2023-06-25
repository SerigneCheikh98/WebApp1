/* eslint-disable react/prop-types */
import { useState } from "react";
import { Row, Col, Form, Button, Toast } from "react-bootstrap";
import { findUser, changeAuthor, getPages } from './API'
import { useNavigate, useParams } from "react-router-dom";

function ChangeAuthorForm(props){
    const [author, setAuthor] = useState('');
    const [ErrorMsg, setErrorMsg] = useState('') ;
    const { pageId } = useParams();
    const navigate = useNavigate();

    const handleChangeSubmit = async (author) => {
        try{
            setErrorMsg('');
            //check if auhtor exist
            await findUser(author);
            // change the author
            await changeAuthor(pageId, author);
            const pages = await getPages();
            props.setPages(pages);
            navigate(`/pages/${pageId}`);
        } catch(error){
            setErrorMsg(error.message);
        }
        
    }

    return (
        <Row>
            <Col >
            {
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>New Author</Form.Label>
                    <Form.Control type='text' placeholder='Author' value={author} onChange={(event) => setAuthor(event.target.value)} />
                </Form.Group>
                <Button className="me-2" variant="success" type="button" disabled={author===''?true:false}  onClick={() => {handleChangeSubmit(author)}}>Update Website Name</Button>
                <Button variant="secondary" type="button" onClick={() => { navigate('/backOffice/pages') }}>Cancel</Button>
                <Toast show={ErrorMsg !== ''} onClose={() => setErrorMsg('')} delay={4000} autohide bg="danger">
                    <Toast.Body>{ErrorMsg}</Toast.Body>
                </Toast>
                </Form>
            }
            </Col>
        </Row>
    )
}

export { ChangeAuthorForm };