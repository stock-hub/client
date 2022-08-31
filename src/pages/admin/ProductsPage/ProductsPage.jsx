import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ProductList from '../../../components/admin/ProductsList/ProductList'

const ProductsPage = () => {
    return (
        <>
            <Container>
                <h3>Productos</h3>
                <Link to="/admin/productos/nuevo">Añadir nuevo producto</Link>
                <ProductList />
            </Container>
        </>
    )
}

export default ProductsPage