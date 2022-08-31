import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import productService from "../../../services/products.service"
import uploadService from "../../../services/upload.services"

const NewProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        onSell: false,
        tags: []
    })

    const [loadingImage, setLoadingImage] = useState(false)

    const navigate = useLocation()

    const handleInputChange = e => {
        const { name, value } = e.target

        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleTags = e => {
        const { value } = e.target

        const tagsArr = []

        tagsArr.push(value)

        setProduct({
            ...product,
            tags: tagsArr
        })
    }

    const uploadProductImages = (e) => {
        setLoadingImage(true)

        const uploadData = new FormData()

        for (let i = 0; i < e.target.files.length; i++) {
            uploadData.append("imageUrl", e.target.files[i])
        }

        uploadService
            .uploadImage(uploadData)
            .then(({ data }) => {
                const newImages = [...product.imageUrl, ...data.cloudinaryUrls]
                setLoadingImage(false)
                setProduct({
                    ...product,
                    imageUrl: newImages,
                })
            })
            .catch((err) => console.log(err))
    }

    const handleSubmit = e => {
        e.prevetDefault()

        productService
            .newProduct(product)
            .then(() => navigate('/admin/productos?page=1'))
            .catch(err => console.log(err))
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre del producto"
                    required
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Descripción del producto"
                    required
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Precio del producto"
                    required
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Seleccionar fotos</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    required
                    name="imageUrl"
                    onChange={uploadProductImages}
                />
            </Form.Group>
            <Form.Check
                type="switch"
                id="custom-switch"
                label="¿Producto en venta?"
                name="onSell"
                onChange={handleInputChange}
            />
            <div className="productTags">
                <p>Etiquetas:</p>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Herramientas"
                    onChange={handleTags}
                    name="Herramientas"
                    checked="Herramientas"
                />
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Maquinaria"
                    onChange={handleTags}
                    name="Maquinaria"
                    checked="Maquinaria"
                />
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Materiales"
                    onChange={handleTags}
                    name="Materiales"
                    checked="Materiales"
                />
            </div>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default NewProductForm