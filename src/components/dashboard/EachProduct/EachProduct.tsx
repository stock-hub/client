import { Button, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Product } from '../../../types/product.type'
import styled from 'styled-components'
import productService from '../../../services/products.service'

const EachProductDiv = styled.div`
  @media screen and (max-width: 480px) {
    .eachAdminProduct {
      text-align: center;
    }

    .eachAdminProduct a,
    .eachAdminProduct button {
      display: block;
      width: 100%;
      margin-bottom: 5px;
    }
  }
`

const ProductImg = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
`

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
        <Col md="2" className="eachProductButtons">
          <Link className="btn btn-outline-info" to={`/dashboard/products/${product._id}`}>
            Abrir
          </Link>{' '}
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
