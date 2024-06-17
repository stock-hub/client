import React from 'react'
import { Container } from 'react-bootstrap'
import { NewProductForm } from '../../../components/dashboard/NewProductForm/NewProductForm'

export const NewProductPage: React.FC = () => {
  return (
    <Container>
      <h3>Añadir nuevo producto</h3>
      <br />
      <NewProductForm />
    </Container>
  )
}
