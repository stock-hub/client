import React from 'react'
import { Container } from 'react-bootstrap'
import { NewInvoiceForm } from '../../../components/dashboard/NewInvoiceForm/NewInvoiceForm'

export const NewInvoicePage: React.FC = () => {
  return (
    <Container>
      <h3>Añadir nueva factura</h3>
      <br />
      <NewInvoiceForm />
    </Container>
  )
}
