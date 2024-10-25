import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, Modal, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { MessageContext } from '../../../context/userMessage.context'
import invoiceService from '../../../services/invoice.service'
import { Invoice, InvoiceProduct } from '../../../types/invoice.type'
import { formatDate, generateInvoiceId } from '../../../utils/tools'
import { Product, ProductResponse } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { QRSignature } from '../../QRSignature/QRSignature'

export const NewInvoiceForm: React.FC = () => {
  const [invoiceId] = useState(generateInvoiceId())
  const [invoice, setInvoice] = useState<Invoice>({
    products: [],
    totalValue: 0,
    deliver: new Date().toString(),
    clientName: '',
    clientAddress: '',
    clientId: '',
    clientTelephone: undefined as unknown as number,
    invoiceId
  })
  const [invoiceProduct, setInvoiceProduct] = useState<InvoiceProduct>({
    product: '',
    name: '',
    quantity: 1
  })
  const [invoiceProducts, setInvoiceProducts] = useState<InvoiceProduct[]>([])
  const navigate = useNavigate()
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [searchProductQuery, setSearchProductQuery] = useState('')
  const [debouncedProductQuery, setDebouncedProductQuery] = useState(searchProductQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [isProductSelected, setIsProductSelected] = useState(false)
  const [productPrice, setProductPrice] = useState<number>(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedProductQuery(searchProductQuery)
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchProductQuery])

  useEffect(() => {
    if (!debouncedProductQuery || isProductSelected) {
      return
    }

    if (debouncedProductQuery) {
      productService
        .getAllProducts(debouncedProductQuery)
        .then(({ data }: { data: ProductResponse }) => {
          setProducts(data)
        })
        .catch((err: Error) => {
          setShowMessage(true)
          setMessageInfo(err.message)
        })
    } else {
      setProducts([])
    }
  }, [debouncedProductQuery, isProductSelected])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (['deliver'].includes(name)) {
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        [name]: new Date(value)
      }))
    } else if (['quantity', 'valuePerDay', 'return', 'deposit'].includes(name)) {
      setInvoiceProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value
      }))
    } else if (name === 'product') {
      setSearchProductQuery(value)
      setIsProductSelected(false)
    } else {
      setInvoice((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleProductSelect = (product: Product) => {
    setInvoiceProduct((prevProduct) => ({
      ...prevProduct,
      product: product._id!,
      name: product.name
    }))
    setSearchProductQuery(product.name)
    setProductPrice(product.price)
    setProducts([])
    setIsProductSelected(true)
  }

  const handleAddNewProduct = () => {
    const total = productPrice * invoiceProduct.quantity
    setInvoiceProducts((prevProducts) => [...prevProducts, invoiceProduct])
    setInvoice((prevState) => ({
      ...prevState,
      totalValue: prevState.totalValue + total
    }))
    setInvoiceProduct({
      product: '',
      quantity: 1,
      name: '',
      deposit: undefined,
      valuePerDay: undefined,
      return: undefined
    })
    setSearchProductQuery('')
    setDebouncedProductQuery('')
    setProductPrice(0)
    setProducts([])
    setIsProductSelected(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!invoiceProducts.length) {
      setInvoice((prevState) => ({
        ...prevState,
        totalValue: productPrice * invoiceProduct.quantity,
        products: [...prevState.products, invoiceProduct]
      }))
    } else {
      setInvoice((prevState) => ({
        ...prevState,
        products: invoiceProducts
      }))
    }

    invoiceService
      .newInvoice(invoice)
      .then(() => navigate('/dashboard/invoices'))
      .catch((err: Error) => {
        setShowMessage(true)
        setMessageInfo(err.message)
      })
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  console.log(invoiceId)

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
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
                value={invoice.clientTelephone || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <h5>Datos del producto</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-1">
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={searchProductQuery}
                onChange={handleInputChange}
                required={invoiceProducts.length ? false : invoiceProduct.product ? false : true}
              />
            </Form.Group>
            {products.length > 0 && (
              <Dropdown.Menu
                show
                style={{
                  width: '41.5%',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {products.map((product, idx) => (
                  <Dropdown.Item key={idx} onClick={() => handleProductSelect(product)}>
                    {product.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de entrega</Form.Label>
              <Form.Control
                type="date"
                name="deliver"
                value={formatDate(invoice.deliver, true)}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                value={invoiceProduct.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Deposito</Form.Label>
              <Form.Control
                type="number"
                name="deposit"
                value={invoiceProduct.deposit || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de devolución</Form.Label>
              <Form.Control
                type="date"
                name="return"
                value={formatDate(invoiceProduct.return, true)}
                onChange={handleInputChange}
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
                value={invoiceProduct.valuePerDay || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" style={{ marginRight: '1rem' }} onClick={handleAddNewProduct}>
          Añadir nuevo producto a factura
        </Button>
        {/* <Button variant="secondary" style={{ marginRight: '1rem' }} onClick={handleShow}> // TODO: Create next step which is to sign the pdf
          Firmar factura
        </Button>
        <Modal show={show} onHide={handleShow}>
          <QRSignature invoiceId={invoiceId} />
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal> */}

        <Button variant="primary" type="submit">
          Crear factura
        </Button>
      </Form>

      <br />

      {invoiceProducts.length > 0 && (
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Valor por día</th>
              <th>Depósito</th>
              <th>Fecha de devolución</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoiceProducts.map((product, idx) => {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.valuePerDay || '-'}</td>
                  <td>{product.deposit || '-'}</td>
                  <td>{product.return || '-'}</td>
                  {/* <td>
                    <Button variant="danger">Borrar</Button> // TODO: Add logic to remove product
                  </td> */}
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}

      <br />
    </Container>
  )
}
