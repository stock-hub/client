import { useContext } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ProductContext } from '../../../context/product.context'
import { Product } from '../../../types/product.type'
import styled from 'styled-components'

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
  const { deleteProduct } = useContext(ProductContext)
  const navigate = useNavigate()

  return (
    <EachProductDiv>
      <Row>
        <Col md='2'>
          <ProductImg src={product.imageUrl[0]} alt={product.name} />
        </Col>
        <Col md='8'>
          <p>
            <strong>{product.name}</strong>
          </p>
          <p>${product.price}</p>
          {product.tags.map((tag, idx) => {
            return (
              <p key={idx} className='AdminProductTag'>
                {tag}
              </p>
            )
          })}
        </Col>
        <Col md='2' className='eachProductButtons'>
          <Link className='btn btn-outline-info' to={`/dashboard/products/${product._id}`}>
            Open
          </Link>{' '}
          <Button
            variant='outline-danger'
            onClick={() => {
              deleteProduct(product._id!)
              navigate(0)
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </EachProductDiv>
  )
}

export default EachProduct
