import React, { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import invoiceService from '../../../services/invoice.service'
import { Invoice } from '../../../types/invoice.type'
import { useNavigate } from 'react-router-dom'
import { MessageContext } from '../../../context/userMessage.context'

export const NewInvoiceForm: React.FC = () => {
  const fileId = uuidv4().split('-').join('')
  const [invoice, setInvoice] = useState<Invoice>({
    quantity: 0,
    product: '',
    totalValue: 0,
    deliver: new Date(),
    clientName: '',
    clientAddress: '',
    clientId: '',
    clientTelephone: '',
    fileId
  })
  const navigate = useNavigate()
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (['deliver', 'return'].includes(name)) {
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        [name]: new Date(value)
      }))
    } else if (name === 'clientTelephone') {
      setInvoice((prevState) => ({
        ...prevState,
        clientTelephone: +value
      }))
    } else {
      setInvoice((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const formatDate = (date?: Date): string => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    invoiceService
      .newInvoice(invoice)
      .then(() => navigate('/dashboard/products?page=1'))
      .catch((err: Error) => {
        setShowMessage(true)
        setMessageInfo(err.message)
      })
  }

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del producto</Form.Label>
          <Form.Control
            type="text"
            name="product"
            value={invoice.product as string}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="0"
                value={invoice.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Valor por día</Form.Label>
              <Form.Control
                type="number"
                name="valuePerDay"
                min="0"
                value={invoice.valuePerDay}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Valor total</Form.Label>
              <Form.Control
                type="number"
                name="totalValue"
                value={invoice.totalValue}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Deposito</Form.Label>
              <Form.Control type="number" name="deposit" value={invoice.deposit} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de entrega</Form.Label>
              <Form.Control
                type="date"
                name="deliver"
                value={formatDate(invoice.deliver)}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de devolución</Form.Label>
              <Form.Control type="date" name="return" value={formatDate(invoice.return)} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>

        <h5>Datos del cliente</h5>

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="clientName"
            value={invoice.clientName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Domicilio</Form.Label>
          <Form.Control
            type="text"
            name="clientAddress"
            value={invoice.clientAddress}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Documento de Identidad</Form.Label>
              <Form.Control
                type="text"
                name="clientId"
                value={invoice.clientId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="clientTelephone"
                value={invoice.clientTelephone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
  )
}
