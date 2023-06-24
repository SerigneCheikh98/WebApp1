/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Stack } from 'react-bootstrap';
import dayjs from 'dayjs';

function PagesList(props) {
    const pages = props.pages;

    const navigate = useNavigate() ;
    // get only published pages
    const filteredPages = pages.filter((page) =>
        dayjs(page.publication_date).isSame(dayjs(), 'day') ||
        dayjs(page.publication_date).isBefore(dayjs(), 'day')
    );

    // order pages by publication date
    filteredPages.sort((a, b) => {
        return dayjs(a.publication_date).diff(dayjs(b.publication_date))
    });

    return <Row xs={1} md={1} className="g-3">
        {filteredPages.map((page) => (
            <Col key={page.id}>
                <Card>
                    <Card.Body>
                        <Card.Title>{page.title}</Card.Title>
                        <Card.Subtitle>{page.author}</Card.Subtitle>
                        <Card.Text><br></br>Published at {page.publication_date} </Card.Text>
                    </Card.Body>
                    <Card.Footer><Link to={`/pages/${page.id}`}>more details...</Link></Card.Footer>
                </Card>
            </Col>
        ))}
        { props.idUser?
            <Col md={6} >
                <Button variant="secondary" type="button" onClick={() => { navigate('/backOffice/pages') }}>Go to Back-Office</Button><br />
            </Col> : ''
        }
        
    </Row>
}

function PagesListBackOffice (props) {
    const pages = props.pages;

    const navigate = useNavigate();

    // order pages by author
    pages.sort((a, b) => (a.author.localeCompare(b.author)));
    
    const getStatus = (publication_date) => {
        if(!publication_date){
            return 'draft';
        }
        if(dayjs(publication_date).isSame(dayjs(), 'day') || dayjs(publication_date).isBefore(dayjs(), 'day')) {
            return 'published';
       }
       if(dayjs(publication_date).isAfter(dayjs(), 'day')){
        return 'scheduled';
       }
    }

    return ( 
            <Row xs={1} md={1} className="g-3">
                {pages.map((page) => (
                    <Col key={page.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{page.title}</Card.Title>
                                <Card.Subtitle>{page.author}</Card.Subtitle>
                                <Card.Text><br></br>Publication date {page.publication_date}</Card.Text>
                                <Card.Text> Status: {getStatus(page.publication_date)} </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="danger" type="button" style={{ display: props.userUsername === page.author ? 'block' : 'none' }} 
                                    onClick={() => { props.handleDeletePage(page.id) }}>Delete Page</Button><br />
                                <Link to={`/pages/${page.id}`}>more details...</Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            <Col md={6} >
            <Stack direction="horizontal" gap={1}  >
                <Button variant="success" type="button" onClick={() => { navigate('/pages/createPage') }}>Create Page</Button>
                <Button variant="secondary" type="button" onClick={() => { navigate('/') }}>Go to Front-Office</Button>
            </Stack>
            </Col>
            </Row>
        )
}

export { PagesList, PagesListBackOffice };
