import { useContext, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import productService from "../../../services/products.service"
import cloudImagesService from "../../../services/cloud_images.service"
import { MessageContext } from "../../../context/userMessage.context"
import "./NewProductForm.css"

const NewProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: [],
        onSell: "off",
        tags: []
    })

    const [loadingImage, setLoadingImage] = useState(false)
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const navigate = useNavigate()

    const handleInputChange = e => {
        const { name, value } = e.target

        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleSelect = e => {
        e.preventDefault()

        const options = e.target.options

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected && !product.tags.includes(options[i].value)) {
                setProduct({
                    ...product,
                    tags: [...product.tags, options[i].value]
                })
            } else if (options[i].selected && product.tags.includes(options[i].value)) {
                const tagIndex = product.tags.indexOf(options[i].value)

                if (tagIndex > -1) {
                    product.tags.splice(tagIndex, 1)

                    setProduct({
                        ...product,
                        tags: product.tags
                    })
                }
            }
        }
    }

    const uploadProductImages = (e) => {
        setLoadingImage(true)

        const uploadData = new FormData()

        for (let i = 0; i < e.target.files.length; i++) {
            uploadData.append("imageUrl", e.target.files[i])
        }

        cloudImagesService
            .uploadImage(uploadData)
            .then(({ data }) => {
                const newImages = [...product.imageUrl, ...data.cloudinaryUrls]
                setLoadingImage(false)
                setProduct({
                    ...product,
                    imageUrl: newImages,
                })
            })
            .catch((err) => {
                console.log(err)
                if (product.imageUrl.length > 0) {
                    setLoadingImage(false)
                }
                setShowMessage(true)
                setMessageInfo({
                    title: 'Error',
                    desc: 'Seleccione imagenes antes de crear el producto.'
                })
            })
    }

    const handleSubmit = e => {
        e.preventDefault()

        productService
            .newProduct(product)
            .then(() => navigate('/admin/productos?page=1'))
            .catch((err) => {
                setShowMessage(true)
                setMessageInfo({ title: 'Error', desc: err.message })
            })
    }

    const removeSelectAttr = (e) => {
        const el = e.target.parentNode

        setTimeout(() => {
            el.selectedIndex = -1
        }, 90)
    }

    const deleteImages = (url) => {
        cloudImagesService
            .deleteImage(url)
            .then(() => {
                const images = product.imageUrl
                const imageIndex = images.indexOf(url)

                if (imageIndex > -1) {
                    images.splice(imageIndex, 1)
                }

                setProduct({
                    ...product,
                    imageUrl: images
                })
            })
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
            <div className="imagesPreview">
                {
                    product.imageUrl?.map((image, idx) => {
                        return <div key={idx}>
                            <button
                                type="button"
                                onClick={() => deleteImages(image)}
                                className={`deleteImage image-${idx}`}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <picture className={`preview preview-${idx + 1}`}>
                                <img src={image} alt={`preview-${idx + 1}`} />
                            </picture>
                        </div>
                    })
                }
            </div>
            <Form.Check
                type="switch"
                id="custom-switch"
                label="¿Producto en venta?"
                name="onSell"
                onChange={handleInputChange}
            />
            <h6>Seleccionar etiquetas:</h6>
            <Form.Select aria-label="Default select example" name="tags" multiple onChange={handleSelect}>
                <option onClick={removeSelectAttr} value="Herramientas">Herramientas</option>
                <option onClick={removeSelectAttr} value="Maquinaria">Maquinaria</option>
                <option onClick={removeSelectAttr} value="Materiales">Materiales</option>
            </Form.Select>
            <br />
            <p>
                Etiquetas seleccionadas: {product.tags.map((el, idx) => <span key={idx} className="newProductTags">{el}</span>)}
            </p>
            <Button
                variant="primary"
                type="submit"
                disabled={loadingImage}
            >
                {loadingImage ? 'Espere...' : 'Enviar'}
            </Button>
        </Form >
    )
}

export default NewProductForm