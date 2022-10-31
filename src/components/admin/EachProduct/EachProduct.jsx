import { useContext } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ProductContext } from "../../../context/product.context"
import './EachProduct.css'

const EachProduct = ({ product }) => {
    const { deleteProduct } = useContext(ProductContext)
    const navigate = useNavigate()

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
                            product.tags.map((tag, idx) => {
                                return <p key={idx} className="AdminProductTag">{tag}</p>
                            })
                        }
                    </Col>
                    <Col md="2" className="eachProductButtons">
                        <Link className="btn btn-outline-info" to={`/productos/${product._id}`}>Ver</Link>
                        {' '}<Button variant="outline-danger"
                            onClick={() => {
                                deleteProduct(product._id)
                                navigate(0)
                            }}>Eliminar</Button>
                    </Col>
                </Row>
            </div>
            <br />
        </>
    )
}

export default EachProduct