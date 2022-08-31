import { Container } from "react-bootstrap"
import NewProductForm from "../../../components/admin/NewProductForm/NewProductForm"


const NewProduct = () => {
    return (
        <Container>
            <h3>Añadir nuevo producto</h3>
            <br />
            <NewProductForm />
        </Container>
    )
}

export default NewProduct