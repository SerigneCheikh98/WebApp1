/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Button, Container, Row, Col, Toast, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManagePageBackOffice = (props) => {
    const [page, setPage] = useState(props.initialState);
    const [ErrorMsg, setErrorMsg] = useState('') ;
    const [selectedImages, setSelectedImages] = useState([]);
    const navigate = useNavigate();
    const pathImages = ['/abstract-banner.jpg', '/commercionetwork.png', '/ferris-happy.svg', '/senegal-can22.jpg', '/windows-11.jpg'];
    
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

    const handleImage = (e, index) => {
        const updatedImages = [...selectedImages];
        updatedImages[index] = e.target.value;
        setSelectedImages(updatedImages);
        handleChange(e, index);
    };

    const handleDatePickerChange = (date) => {
        //date passed by DatePicker
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

    const handleRemoveBlock = (index) => {
        setPage(prevPage => {
            const blocks = [...prevPage.blocks];
            if (blocks[index].removable) {
                if(blocks[index].type==='Image'){
                    const s = [...selectedImages];
                    s.splice(index, 1);
                    setSelectedImages(s)
                }
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
            try{
                if( props.action === 'add'){
                    await props.handleAddPage(page)
                }
                else{
                    await props.handleEditPage(page);
                }
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
                                    {block.type === 'Image'? 
                                        <Form.Select value={selectedImages[index]} name="content" onChange={(e) => {handleImage(e, index) }}>
                                            <option value="">Select an image</option>
                                            {pathImages.map((path, index) => (
                                                <option key={index} value={path}>{path.slice(1, path.lastIndexOf('.'))}</option>//ignore the / and extension
                                            ))}
                                        </Form.Select> :
                                        <Form.Control as="textarea" rows={3} name="content" value={block.content} onChange={e => handleChange(e, index)} />
                                    }<br />
                                    {block.type === 'Image' && selectedImages[index] && (
                                        <Image src={selectedImages[index]} rounded  style={{ width: '300px', height: 'auto' }}/>
                                    )}
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

export { ManagePageBackOffice };
