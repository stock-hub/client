import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Product } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { useParams } from 'react-router-dom'
import { EditProductForm } from '../../../components/dashboard/EditProductForm/EditProductForm'

interface RouteParams {
  [key: string]: string | undefined
  productId: string
}

export const EditProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    price: '' as unknown as number,
    imageUrl: [],
    tags: [],
    onSell: false,
    inStock: false,
    quantity: 0
  })
  const { productId } = useParams<RouteParams>()

  useEffect(() => {
    productService
      .getProduct(productId as string)
      .then(({ data }: { data: Product }) => setProduct(data))
      .catch((error: Error) => console.error(error))
  }, [productId])

  return (
    <Container>
      <h3>Editar {product.name}</h3>
      <br />
      <EditProductForm product={product} />
    </Container>
  )
}
