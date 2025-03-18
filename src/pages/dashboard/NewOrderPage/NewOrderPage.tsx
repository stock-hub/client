import React from 'react'
import { Container } from 'react-bootstrap'
import { NewOrderForm } from '../../../components/dashboard/NewOrderForm/NewOrderForm'

export const NewOrderPage: React.FC = () => {
  return (
    <Container>
      <h3>Añadir nuevo pedido</h3>
      <br />
      <NewOrderForm />
    </Container>
  )
}
