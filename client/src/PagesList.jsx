/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';

function PagesList(props) {
    const pages = props.pages;
    // order pages by publicatio date
    pages.sort((a, b) => {
        return dayjs(a.publication_date).diff(dayjs(b.publication_date))
    });

    return <Row xs={1} md={1} className="g-3">
        {pages.map((page) => (
            <Col key={page.id}>
                <Card>
                    <Card.Body>
                        <Card.Title>{page.title}</Card.Title>
                        <Card.Subtitle>{page.author}</Card.Subtitle>
                        <Card.Text><br></br>Created at {page.date} </Card.Text>
                    </Card.Body>
                    <Card.Footer><Link to={`/pages/${page.id}`}>more details...</Link></Card.Footer>
                </Card>
            </Col>
        ))}
    </Row>
}

export { PagesList };
