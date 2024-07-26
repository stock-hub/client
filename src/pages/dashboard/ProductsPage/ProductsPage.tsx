import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ProductsList } from '../../../components/dashboard/ProductsList/ProductsList'

export const ProductsPage: React.FC = () => {
  return (
    <>
      <Container>
        <h3>Lista de productos</h3>
        <Link to="/dashboard/products/new" className="btn btn-outline-primary">
          Añadir nuevo producto
        </Link>
        <br />
        <br />
        <ProductsList />
      </Container>
    </>
  )
}
