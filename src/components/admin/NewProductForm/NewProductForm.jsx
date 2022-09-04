import { useEffect, useState } from "react"
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
        onSell: "off",
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

    useEffect(() => {
        window.onmousedown = function (e) {
            const el = e.target
            if (el.tagName.toLowerCase() === 'option' && el.parentNode.hasAttribute('multiple')) {
                e.preventDefault()

                // toggle selection
                if (el.hasAttribute('selected')) el.removeAttribute('selected')
                else el.setAttribute('selected', '')

                // hack to correct buggy behavior
                const select = el.parentNode.cloneNode(true)
                el.parentNode.parentNode.replaceChild(select, el.parentNode)
            }
        }
    })

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
            <Form.Select aria-label="Default select example" name="tags" multiple>
                <option value="Herramientas">Herramientas</option>
                <option value="Maquinaria">Maquinaria</option>
                <option value="Materiales">Materiales</option>
            </Form.Select>
            <Button variant="primary" type="submit" disabled={loadingImage}>{loadingImage ? 'Espere...' : 'Enviar'}</Button>
        </Form >
    )
}

export default NewProductForm