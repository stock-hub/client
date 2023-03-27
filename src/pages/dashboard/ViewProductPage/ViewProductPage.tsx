import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { Product } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { ViewProductImgs } from '../../../components/dashboard/ViewProductImgs/ViewProductImgs'

interface RouteParams {
  [key: string]: string | undefined
  productId: string
}

export const ViewProductPage: React.FC = () => {
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    price: '',
    imageUrl: [],
    tags: [],
    onSell: ''
  })
  const { productId } = useParams<RouteParams>()
  const onSell = product.onSell ? 'Producto en venta' : ''

  useEffect(() => {
    productService
      .getProduct(productId as string)
      .then(({ data }: { data: Product }) => setProduct(data))
      .catch((err: Error) => console.log(err))
  }, [productId])

  return (
    <>
      <Container>
        <br />
        <Button variant='outline-primary' onClick={() => navigate(-1)}>
          Volver
        </Button>
        <br />
        <br />
        <ViewProductImgs imgs={product.imageUrl} />
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        <p>{onSell}</p>
        <p>{product.description}</p>
        <Button variant='outline-danger' onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Container>
      <br />
      <br />
    </>
  )
}
