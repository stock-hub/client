import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import productService from '../../../services/products.service'
import cloudImagesService from '../../../services/cloud_images.service'
import { MessageContext } from '../../../context/userMessage.context'
import { Product } from '../../../types/product.type'
import { titleize } from '../../../utils/tools'
import { DeleteImageBtn, ImagesPreview, NewProductTag, PicturePreview } from './EditProductForm.styled'

export const EditProductForm: React.FC<{ product: Product }> = ({ product }: { product: Product }) => {
  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    name: '',
    description: '',
    price: '' as unknown as number,
    imageUrl: [],
    onSell: 'off',
    inStock: 'off',
    tags: []
  })

  useEffect(() => {
    if (product) {
      setUpdatedProduct(product)
    }
  }, [product])

  const [loadingImage, setLoadingImage] = useState(false)
  const [newUploadedImgs, setNewUploadedImgs] = useState<string[]>([])
  const [removedImgs, setRemovedImgs] = useState<string[]>([])
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const maxImagesReached = updatedProduct.imageUrl.length >= 5
  const productHasImages = Boolean(updatedProduct.imageUrl.length)

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target

    if (['onSell', 'inStock'].includes(name)) {
      setUpdatedProduct({
        ...updatedProduct,
        [name]: checked ? 'on' : 'off'
      })
    } else {
      setUpdatedProduct({
        ...updatedProduct,
        [name]: value
      })
    }
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()

    const options = e.target.options

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected && !updatedProduct.tags.includes(options[i].value)) {
        setUpdatedProduct({
          ...updatedProduct,
          tags: [...updatedProduct.tags, options[i].value]
        })
      } else if (options[i].selected && updatedProduct.tags.includes(options[i].value)) {
        const tagIndex = updatedProduct.tags.indexOf(options[i].value)

        if (tagIndex > -1) {
          updatedProduct.tags.splice(tagIndex, 1)

          setUpdatedProduct({
            ...updatedProduct,
            tags: updatedProduct.tags
          })
        }
      }
    }
  }

  const uploadProductImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImage(true)

    const uploadData = new FormData()

    for (let i = 0; i < e.target.files!.length; i++) {
      uploadData.append('imageUrl', e.target.files![i])
    }

    try {
      const { data } = await cloudImagesService.uploadImage(uploadData)
      const newImages = [...updatedProduct.imageUrl, ...data.cloudinary_urls]
      const imgDiff = newImages.filter((x) => !updatedProduct.imageUrl.includes(x))

      setUpdatedProduct({
        ...updatedProduct,
        imageUrl: newImages
      })
      setNewUploadedImgs(imgDiff)

      setLoadingImage(false)
    } catch (err) {
      console.error(err)
      if (updatedProduct.imageUrl.length > 0) {
        setLoadingImage(false)
      }
      setShowMessage(true)
      setMessageInfo('You must select at least one image.')
    }
  }

  const removeSelectAttr = (e: React.MouseEvent<HTMLOptionElement, MouseEvent>) => {
    const el = (e.target as Element).parentNode as HTMLSelectElement

    setTimeout(() => {
      el.selectedIndex = -1
    }, 90)
  }

  const removeImage = (url: string) => {
    const images = updatedProduct.imageUrl
    const imageIndex = images.indexOf(url)

    if (imageIndex > -1) {
      images.splice(imageIndex, 1)
    }

    setRemovedImgs([...removedImgs, url])

    setUpdatedProduct({
      ...updatedProduct,
      imageUrl: images
    })
  }

  const deleteRemovedImages = () => {
    removedImgs.forEach((imgUrl) => cloudImagesService.deleteImage(imgUrl))
  }

  const deleteImages = () => {
    newUploadedImgs.forEach((imgUrl) => cloudImagesService.deleteImage(imgUrl))

    navigate(-1)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    productService
      .editProduct(product._id!, updatedProduct)
      .then(() => {
        deleteRemovedImages()
        navigate(`/dashboard/products/${product._id}`)
      })
      .catch((err: Error) => {
        setShowMessage(true)
        setMessageInfo(err.message)
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
        <Form.Label>Imagenes (5 max.)</Form.Label>
        <Form.Control
          type="file"
          multiple
          required={!productHasImages}
          name="imageUrl"
          onChange={uploadProductImages}
          disabled={maxImagesReached}
        />
      </Form.Group>
      <ImagesPreview>
        {updatedProduct.imageUrl.map((url, idx) => {
          return (
            <div key={idx}>
              <DeleteImageBtn type="button" onClick={() => removeImage(url)} className={`image-${idx}`}>
                <i className="fa-solid fa-xmark"></i>
              </DeleteImageBtn>
              <PicturePreview className={`preview preview-${idx + 1}`}>
                <img src={url} alt={`preview-${idx + 1}`} />
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
        {product.user?.tags.map((tag: string, idx: number) => {
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
        {updatedProduct.tags.map((el, idx) => (
          <NewProductTag key={idx}>{el}</NewProductTag>
        ))}
      </p>
      <Button variant="primary" type="submit" disabled={loadingImage}>
        {loadingImage ? 'Espere...' : 'Actualizar'}
      </Button>
      <Button variant="danger" type="button" onClick={deleteImages}>
        Cancelar
      </Button>
    </Form>
  )
}
