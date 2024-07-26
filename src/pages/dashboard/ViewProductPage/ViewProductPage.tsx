import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
    onSell: '',
    inStock: ''
  })
  const { productId } = useParams<RouteParams>()
  const onSell = product.onSell ? 'Producto en venta' : ''

  useEffect(() => {
    productService
      .getProduct(productId as string)
      .then(({ data }: { data: Product }) => setProduct(data))
      .catch((err: Error) => console.error(err))
  }, [productId])

  return (
    <>
      <Container>
        <br />
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <br />
        <br />
        <ViewProductImgs imgs={product.imageUrl} />
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        <p>{onSell}</p>
        <p>{product.description}</p>
        <Link className="btn btn-outline-info" to={`/dashboard/products/${product._id}/edit`}>
          Editar
        </Link>
      </Container>
      <br />
      <br />
    </>
  )
}
