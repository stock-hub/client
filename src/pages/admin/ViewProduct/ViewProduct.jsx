import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import productService from "../../../services/products.service"

const ViewProduct = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({})
    const { productId } = useParams()

    useEffect(() => {
        productService
            .getProduct(productId)
            .then(({ data }) => setProduct(data))
    }, [])

    return (
        <>
            <Button
                variant="outline-primary"
                onClick={() => navigate(-1)}>Volver</Button>
            <h3>{product.name}</h3>
        </>
    )
}

export default ViewProduct