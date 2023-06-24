/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import { createPage, getPages } from './API'
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

const AddPageBackOffice = (props) => {
    const [page, setPage] = useState({
        title: '',
        publication_date: null,
        blocks: [
            { type: 'Header', content: '', position: 1, removable: false },
            { type: 'Paragraph', content: '', position: 2, removable: false },
        ],
    });
    const [ErrorMsg, setErrorMsg] = useState('') ;
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === 'title') {
            setPage(prevPage => ({ ...prevPage, [name]: value }));
        } else {
            setPage(prevPage => {
                const blocks = [...prevPage.blocks];
                if(name === 'position'){
                    blocks[index][name] = Number(value);
                    return { ...prevPage, blocks };
                }
                blocks[index][name] = value;
                return { ...prevPage, blocks };
            });
        }
    };

    const handleDatePickerChange = (date) => {
        setPage(prevPage => ({ ...prevPage, publication_date: date }));
    };

    const handleAddBlock = () => {
        setPage(prevPage => {
            const blocks = [...prevPage.blocks];
            const position = Number(blocks.length + 1);
            blocks.push({ type: '', content: '', position, removable: true });
            return { ...prevPage, blocks };
        });
    };

    const handleRemoveBlock = index => {
        setPage(prevPage => {
            const blocks = [...prevPage.blocks];
            if (blocks[index].removable) {
                //delete the block from the array
                blocks.splice(index, 1);
            }
            return { ...prevPage, blocks };
        });
    };

    const handleSubmit = async (e) => {
        // prevent from page refreshing
        e.preventDefault();
        // validate 
        const result = validateInputs(page);
        if(result.valide){
            //prepare datas
            let pDate=null;
            if(page.publication_date){
                pDate = dayjs(page.publication_date).format('YYYY-MM-DD');
            }
            const formattedPage = {title:page.title, publication_date: pDate, 
                blocks: page.blocks.map((b) => {return {type: b.type, content: b.content, position: b.position}})};
            try{
                await createPage(formattedPage);
                const updatedPagesList = await getPages();
                props.setPages(updatedPagesList);
                navigate('/backOffice/pages');
            }catch(error){
                setErrorMsg(error);
            }
        }
        else{
            setErrorMsg(result.error);
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" value={page.title} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="publication_date">
                    <Form.Label>Publication Date</Form.Label>
                    <br />
                    <DatePicker selected={page.publication_date} onChange={handleDatePickerChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Blocks</Form.Label>
                    {page.blocks.map((block, index) => (
                        <div key={index}>
                            <Row>
                                <Col>
                                    <Form.Select name="type" value={block.type} onChange={e => handleChange(e, index)}>
                                        <option>Select block type</option>
                                        <option value="Header">Header</option>
                                        <option value="Paragraph">Paragraph</option>
                                        <option value="Image">Image</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Control as="textarea" rows={3} name="content" value={block.content} onChange={e => handleChange(e, index)} />
                                </Col>
                                <Col>
                                    <Form.Control type="number" name="position" min={1} max={page.blocks.length} value={block.position} onChange={e => handleChange(e, index)} />
                                </Col>
                                <Col>
                                    {block.removable && (
                                        <Button variant="danger" onClick={() => handleRemoveBlock(index)}>
                                            Remove
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <br />
                        </div>
                    ))}
                </Form.Group>
                <Button variant="primary" onClick={handleAddBlock}>Add Block</Button>{' '}
                <Button variant="success" type="submit">Submit</Button>{' '}
                <Button variant="secondary" type="button" onClick={() => { navigate('/backOffice/pages') }}>Cancel</Button>
                <Toast show={ErrorMsg !== ''} onClose={() => setErrorMsg('')} delay={4000} autohide bg="danger">
                    <Toast.Body>{ErrorMsg}</Toast.Body>
                </Toast>
            </Form>
        </Container>
    );
};

const validateInputs = (page) => {
    if(page.title.trim().length === 0 ){
        return {error: "Invalid title"};
    }
    let haveHeaderBlock = false;
    let haveParagraphOrImage = false;
    let someErr = null;
    page.blocks.forEach((b) => {
        if(b.type.trim().length===0){
            someErr = {error: "Invalid block type"};
        }
        if(b.type === 'Header'){
            haveHeaderBlock = true;
        }
        if(b.type === 'Paragraph' || b.type === 'Image'){
            haveParagraphOrImage = true;
        }
        if (b.content.trim().length === 0) {
            someErr = {error: "Invalid content in blocks"};
        }
    })
    // Check if there is at leat one Header block and one block of other type
    if( !haveHeaderBlock || !haveParagraphOrImage ){
        return { error: "Must have at least one  \"Header\" and one \"Paragraph\" or \"Image\""};
    }
    // Check if some error occured
    if(someErr !== null){
        return someErr;
    }
    // Check for duplicate positions
    const positions = page.blocks.map(block => block.position);
    if (positions.length !== new Set(positions).size) {
        return { error: "Invalid positions" };
    }
    
    return {valide: "ok"};
}

export { AddPageBackOffice };