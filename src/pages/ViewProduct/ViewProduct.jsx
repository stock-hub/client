import { useEffect, useState } from "react"
import { Button, Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import ViewProductImgs from "../../components/ViewProductImgs/ViewProductImgs"
import productService from "../../services/products.service"
import "./ViewProduct.css"

const ViewProduct = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({})
    const { productId } = useParams()
    const onSell = product.onSell ? "Producto en venta" : ""

    useEffect(() => {
        productService
            .getProduct(productId)
            .then(({ data }) => setProduct(data)) // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Container>
                <br />
                <Button
                    variant="outline-primary"
                    onClick={() => navigate(-1)}>Volver</Button>
                <br /><br />
                <ViewProductImgs imgs={product.imageUrl} />
                <h1>{product.name}</h1>
                <p>${product.price}</p>
                <p>{onSell}</p>
                <p>{product.description}</p>
            </Container>
        </>
    )
}

export default ViewProduct