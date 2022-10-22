import { useContext } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ProductContext } from "../../../context/product.context"
import productService from "../../../services/products.service"
import './EachProduct.css'

const EachProduct = ({ product }) => {

    const { getProducts } = useContext(ProductContext)
    const navigate = useNavigate()

    const deleteProduct = () => {
        productService
            .deleteProduct(product._id)
            .then(() => {
                getProducts()
                navigate(0)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <div className="eachAdminProduct">
                <Row>
                    <Col md="2">
                        <img src={product.imageUrl[0]} alt={product.name} className="AdminProductImg" />
                    </Col>
                    <Col md="8">
                        <p><strong>{product.name}</strong></p>
                        <p>${product.price}</p>
                        {
                            product.tags.map((tag) => {
                                return <p class="AdminProductTag">{tag}</p>
                            })
                        }
                    </Col>
                    <Col md="2" className="eachProductButtons">
                        <Link className="btn btn-outline-info" to={`/productos/${product._id}`}>Ver</Link>
                        {' '}<Button variant="outline-danger"
                            onClick={deleteProduct}>Eliminar</Button>
                    </Col>
                </Row>
            </div>
            <br />
        </>
    )
}

export default EachProduct