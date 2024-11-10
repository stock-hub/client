import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import productService from '../../../services/products.service'
import cloudImagesService from '../../../services/cloud_images.service'
import { MessageContext } from '../../../context/userMessage.context'
import { Product } from '../../../types/product.type'
import styled from 'styled-components'
import { AuthContext } from '../../../context/auth.context'
import { titleize } from '../../../utils/tools'

const NewProductTag = styled.span`
  background-color: #d3d0d0;
  padding: 3px 3px;
  border-radius: 5px;
  margin-right: 5px;
`

const ImagesPreview = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;

  & > div {
    padding: 10px;
  }
`

const PicturePreview = styled.picture`
  & img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    border-radius: 5px;
  }
`

const DeleteImageBtn = styled.button`
  background: none;
  border: 2px solid red;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  color: red;
  font-size: 1.5rem;
  position: absolute;

  & i {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 5px;
  }
`

export const NewProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: '' as unknown as number,
    imageUrl: [],
    onSell: 'off',
    inStock: 'off',
    tags: []
  })

  const [loadingImage, setLoadingImage] = useState(false)
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    if (['onSell', 'inStock'].includes(name)) {
      setProduct({
        ...product,
        [name]: checked ? 'on' : 'off'
      })
    } else {
      setProduct({
        ...product,
        [name]: value
      })
    }
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  const uploadProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImage(true)

    const uploadData = new FormData()

    for (let i = 0; i < e.target.files!.length; i++) {
      uploadData.append('imageUrl', e.target.files![i])
    }

    cloudImagesService
      .uploadImage(uploadData)
      .then(({ data }: { data: { cloudinary_urls: Array<string> } }) => {
        const newImages = [...product.imageUrl, ...data.cloudinary_urls]
        setLoadingImage(false)
        setProduct({
          ...product,
          imageUrl: newImages
        })
      })
      .catch((err: Error) => {
        console.error(err)
        if (product.imageUrl.length > 0) {
          setLoadingImage(false)
        }
        setShowMessage(true)
        setMessageInfo('You must select at least one image.')
      })
  }

  const removeSelectAttr = (e: React.MouseEvent<HTMLOptionElement, MouseEvent>) => {
    const el = (e.target as Element).parentNode as HTMLSelectElement

    setTimeout(() => {
      el.selectedIndex = -1
    }, 90)
  }

  const deleteImage = (url: string) => {
    cloudImagesService.deleteImage(url).then(() => {
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

  const deleteImages = () => {
    product.imageUrl.forEach((imgUrl) => cloudImagesService.deleteImage(imgUrl))

    navigate(-1)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    productService
      .newProduct(product)
      .then(() => navigate('/products?page=1'))
      .catch((err: Error) => {
        setShowMessage(true)
        setMessageInfo(err.message)
      })
  }

  return (
    user && (
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
          <Form.Label>Imagenes</Form.Label>
          <Form.Control type="file" multiple required name="imageUrl" onChange={uploadProductImages} />
        </Form.Group>
        <ImagesPreview>
          {product.imageUrl?.map((image, idx) => {
            return (
              <div key={idx}>
                <DeleteImageBtn type="button" onClick={() => deleteImage(image)} className={`image-${idx}`}>
                  <i className="fa-solid fa-xmark"></i>
                </DeleteImageBtn>
                <PicturePreview className={`preview preview-${idx + 1}`}>
                  <img src={image} alt={`preview-${idx + 1}`} />
                </PicturePreview>
              </div>
            )
          })}
        </ImagesPreview>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Producto en venta?"
          name="onSell"
          onChange={handleInputChange}
        />
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Producto en stock?"
          name="inStock"
          onChange={handleInputChange}
        />
        <h6>Elegir etiquetas:</h6>
        <Form.Select aria-label="Default select example" name="tags" multiple onChange={handleSelect}>
          {user.tags.map((tag, idx) => {
            return (
              <option key={idx} onClick={removeSelectAttr} value={tag}>
                {titleize(tag)}
              </option>
            )
          })}
        </Form.Select>
        <br />
        <p>
          Etiquetas seleccionadas:{' '}
          {product.tags.map((el, idx) => (
            <NewProductTag key={idx}>{el}</NewProductTag>
          ))}
        </p>
        <Button variant="primary" type="submit" disabled={loadingImage}>
          {loadingImage ? 'Espere...' : 'Crear'}
        </Button>
        <Button variant="danger" type="button" onClick={deleteImages}>
          Cancelar
        </Button>
      </Form>
    )
  )
}
