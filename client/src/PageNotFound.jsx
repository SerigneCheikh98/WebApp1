import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function PageNotFound() {

    return <Alert variant='danger'>
        <h1> Page not found!</h1>
        <p><Link to='/'>Go back to home page</Link></p>
    </Alert>
}

export { PageNotFound };