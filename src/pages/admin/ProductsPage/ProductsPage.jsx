import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ProductList from '../../../components/admin/ProductsList/ProductList'

const ProductsPage = () => {
    return (
        <>
            <Container>
                <h3>Productos</h3>
                <Link to="/admin/productos/nuevo" className='btn btn-outline-primary'>Añadir nuevo producto</Link>
                <br />
                <br />
                <ProductList />
            </Container>
        </>
    )
}

export default ProductsPage