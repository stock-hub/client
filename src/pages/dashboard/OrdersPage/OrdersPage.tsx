import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { OrdersList } from '../../../components/dashboard/OrdersList/OrdersList'

export const OrdersPage: React.FC = () => {
  return (
    <Container>
      <h3>Pedidos</h3>
      <Link to="/orders/new" className="btn btn-outline-primary">
        Crear nuevo pedido
      </Link>
      <br />
      <br />
      <OrdersList />
    </Container>
  )
}
