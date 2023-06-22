/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import { Button, Image, Row, Col, Badge, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getPageWithBlocks } from "./API";

function PageWithBlocks() {
    const { pageId } = useParams();
    const navigate = useNavigate();

    const [blocks, setBlocks] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
        // returned object is { page: page, blocks: [blocks] }
        getPageWithBlocks(pageId).then(list => {
            setBlocks(list.blocks);
            setPageInfo(list.page);
        })
    }, [pageId]);

    return <div>
        <PageInfos page={pageInfo} /><br></br>
        <BlocksTable blocks={blocks} /><br />
        <p><Button variant="secondary" onClick={() => { navigate('/') }}>CLOSE</Button></p>
    </div>

}

function PageInfos(props) {
    return (
        <div>
            <Row>
                <Col md={4} className='lead'>
                    Author:  <Badge bg='dark'>{props.page ? props.page.author : "Loading..."}</Badge>
                </Col>
                <Col md={4}>
                    <p className='lead'>{props.page ? props.page.title : "Loading..."}</p>
                </Col>
                <Col md={4} className='text-end'>
                    Created <Badge pill bg='secondary'>{props.page ? props.page.date : "Loading..."}</Badge><br></br>
                    Publicated <Badge pill bg='secondary'>{props.page ? props.page.publication_date : "Loading..."}</Badge>
                </Col>
            </Row>

        </div>
    )
}

function BlocksTable(props) {
    // set blocks order
    let orderedBlocks = [...props.blocks];
    orderedBlocks.sort((a, b) => (a.position - b.position));

    return (
        <Card>
            <Card.Body>
                <Row className="justify-content-center" md={1} xs={1}>
                    {orderedBlocks.map((block) => (
                        <Col key={block.id} className="text-center">
                            {block.type === 'Image' ? <Image src={block.content} rounded  style={{ width: '200px', height: 'auto' }}/> : block.content}
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
    //     <Card>
    //       <ListGroup variant="flush">
    //         {orderedBlocks.map((block) => (
    //           <ListGroup.Item key={block.id} style={{border: 0}}>
    //             {   block.type === 'Image' ? <Image src={block.content} rounded /> : block.content }
    //           </ListGroup.Item>
    //         ))}
    //       </ListGroup>
    //     </Card>
    // );
}

export { PageWithBlocks };