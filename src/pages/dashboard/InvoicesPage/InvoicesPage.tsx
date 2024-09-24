import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { InvoicesList } from '../../../components/dashboard/InvoicesList/InvoicesList'

export const InvoicesPage: React.FC = () => {
  return (
    <Container>
      <h3>Facturas</h3>
      <Link to="/dashboard/invoices/new" className="btn btn-outline-primary">
        Crear nueva factura
      </Link>
      <br />
      <br />
      <InvoicesList />
    </Container>
  )
}
