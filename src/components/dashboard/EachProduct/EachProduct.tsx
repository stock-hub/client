import { Button, Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { ActionLink, EachProductDiv, ProductImg } from './EachProduct.styled'

const EachProduct: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate()

  const deleteProduct = (productId: string) => {
    productService
      .deleteProduct(productId)
      .then(() => navigate(0))
      .catch((err: Error) => console.error(err))
  }

  return (
    <EachProductDiv>
      <Row>
        <Col md="2">
          <ProductImg src={product.imageUrl[0]} alt={product.name} />
        </Col>
        <Col md="8">
          <p>
            <strong>{product.name}</strong>
          </p>
          <p>${product.price}</p>
          {product.tags.map((tag, idx) => {
            return (
              <p key={idx} className="AdminProductTag">
                {tag}
              </p>
            )
          })}
        </Col>
        <Col md="2">
          <ActionLink className="btn btn-outline-info" to={`/products/${product._id}`}>
            Abrir
          </ActionLink>{' '}
          <Button
            variant="outline-danger"
            onClick={() => {
              deleteProduct(product._id!)
            }}
          >
            Borrar
          </Button>
        </Col>
      </Row>
    </EachProductDiv>
  )
}

export default EachProduct
