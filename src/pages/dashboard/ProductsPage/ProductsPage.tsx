import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ProductsList } from '../../../components/dashboard/ProductsList/ProductsList'

export const ProductsPage: React.FC = () => {
  return (
    <>
      <Container>
        <h3>Products List</h3>
        <Link to='/dashboard/products/new' className='btn btn-outline-primary'>
          Add new product
        </Link>
        <br />
        <br />
        <ProductsList />
      </Container>
    </>
  )
}
