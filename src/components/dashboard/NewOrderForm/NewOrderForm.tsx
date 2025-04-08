import { pdf } from '@react-pdf/renderer'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import { MessageContext } from '../../../context/userMessage.context'
import clientService from '../../../services/client.service'
import cloudFilesService from '../../../services/cloud_files.service'
import orderService from '../../../services/order.service'
import productService from '../../../services/products.service'
import { Client } from '../../../types/client.type'
import { Order, OrderProduct, OrderSignatureResponse } from '../../../types/order.type'
import { Product, ProductResponse } from '../../../types/product.type'
import {
  calculateTotalValue,
  diffDays,
  formatAmount,
  formatDate,
  formatToDatetimeLocal,
  generateOrderId
} from '../../../utils/tools'
import { QRSignature } from '../../QRSignature/QRSignature'
import { EachOrderPDF } from '../EachOrderPDF/EachOrderPDF'
import GoogleMaps, { LocationData } from '../../GoogleMaps/GoogleMaps'

export const NewOrderForm: React.FC = () => {
  const [orderId] = useState(generateOrderId())
  const [order, setOrder] = useState<Order>({
    products: [],
    totalValue: 0,
    clientName: '',
    clientAddress: '',
    clientId: '',
    clientEmail: '',
    clientTelephone: undefined as unknown as number,
    orderId
  })
  const [orderProduct, setOrderProduct] = useState<OrderProduct>({
    deliver: new Date(),
    product: '',
    name: '',
    price: 0,
    quantity: 1,
    location: ''
  })
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])
  const [client, setClient] = useState<Client | undefined>(undefined)
  const [clientNotFound, setClientNotFound] = useState(false)
  const navigate = useNavigate()
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [searchProductQuery, setSearchProductQuery] = useState('')
  const [debouncedProductQuery, setDebouncedProductQuery] = useState(searchProductQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [isProductSelected, setIsProductSelected] = useState(false)
  const [show, setShow] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [signUrl, setSignUrl] = useState<string | undefined>('')
  const { user } = useContext(AuthContext)

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
        .catch((error: Error) => {
          setShowMessage(true)
          setMessageInfo(error.message)
        })
    } else {
      setProducts([])
    }
  }, [debouncedProductQuery, isProductSelected, setMessageInfo, setShowMessage])

  const getClient = (dni: string) => {
    clientService
      .getClient(dni)
      .then(({ data }: { data: Client }) => {
        if (!data) {
          setClientNotFound(true)
        } else {
          setClient(data)
          setShowClientModal(true)
          setClientNotFound(false)
        }
      })
      .catch((error: Error) => {
        setShowMessage(true)
        setMessageInfo(error.message)
      })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (['deliver'].includes(name)) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: new Date(value)
      }))
    } else if (['quantity', 'valuePerDay', 'return', 'deposit', 'location'].includes(name)) {
      if (name === 'return') {
        setOrderProduct((prevProduct) => ({
          ...prevProduct,
          [name]: new Date(value)
        }))
      } else {
        setOrderProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value
        }))
      }
    } else if (name === 'product') {
      setSearchProductQuery(value)
      setIsProductSelected(false)
    } else {
      setOrder((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleProductSelect = (product: Product) => {
    setOrderProduct((prevProduct) => ({
      ...prevProduct,
      product: product._id!,
      name: product.name,
      price: product.price
    }))
    setSearchProductQuery(product.name)
    setProducts([])
    setIsProductSelected(true)
  }

  const handleAddNewProduct = () => {
    setOrderProducts((prevProducts) => [...prevProducts, orderProduct])
    setOrder((prevState) => ({
      ...prevState,
      products: [...prevState.products, orderProduct],
      totalValue: calculateTotalValue(orderProduct, orderProducts)
    }))
    setOrderProduct({
      deliver: new Date(),
      product: '',
      quantity: 1,
      name: '',
      price: 0,
      deposit: undefined,
      return: undefined
    })
    setSearchProductQuery('')
    setDebouncedProductQuery('')
    setProducts([])
    setIsProductSelected(false)
  }

  const uploadOrderPdf = async (order: Order) => {
    const pdfDocument = user && pdf(<EachOrderPDF order={order} signUrl={signUrl!} user={user} />)
    if (!pdfDocument) return

    const pdfBlob = await pdfDocument.toBlob()

    const formData = new FormData()
    formData.append('file', pdfBlob)
    formData.append('fileId', order.orderId!)

    cloudFilesService.uploadFile(formData).catch((error: Error) => {
      setShowMessage(true)
      setMessageInfo(error.message)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let updatedOrder: Order

    if (orderProduct.name && orderProducts.length) {
      updatedOrder = {
        ...order,
        products: [...orderProducts, orderProduct],
        totalValue: calculateTotalValue(orderProduct, orderProducts)
      }
    } else {
      updatedOrder = {
        ...order,
        products: orderProducts.length ? orderProducts : [orderProduct],
        ...(!orderProducts.length && { totalValue: calculateTotalValue(orderProduct) })
      }
    }

    setOrder(updatedOrder)

    orderService
      .newOrder(updatedOrder)
      .then(({ data }: { data: Order }) => {
        uploadOrderPdf(data)
        navigate('/orders')
      })
      .catch((error: Error) => {
        setShowMessage(true)
        setMessageInfo(error.message)
      })
  }

  const handleClose = () => {
    setShow(false)

    orderService
      .getSignature(orderId)
      .then(({ data }: OrderSignatureResponse) => {
        setSignUrl(data.signature)
      })
      .catch((error: Error) => {
        setShowMessage(true)
        setMessageInfo(error.message)
      })
  }

  const fillExistingClientData = (clientData: Client | undefined) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      ...(clientData?.name && { clientName: clientData.name }),
      ...(clientData?.address && { clientAddress: clientData.address }),
      ...(clientData?.dni && { clientId: clientData.dni }),
      ...(clientData?.email && { clientEmail: clientData.email }),
      ...(clientData?.phone && { clientTelephone: clientData.phone })
    }))
    setShowClientModal(false)
  }

  const handleShow = () => setShow(true)

  const handleLocationSelect = (location: LocationData) => {
    setOrderProduct((prev) => ({ ...prev, location: location.address }))
  }

  const handleRemoveProduct = (product: OrderProduct) => {
    setOrderProducts((prevProducts) => prevProducts.filter((p) => p !== product))
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: prevOrder.products.filter((p) => p !== product),
      totalValue: prevOrder.totalValue - calculateTotalValue(product)
    }))
  }

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <h5>Datos del cliente</h5>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="clientName" value={order.clientName} onChange={handleInputChange} required />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Domicilio</Form.Label>
              <Form.Control
                type="text"
                name="clientAddress"
                value={order.clientAddress}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Documento de Identidad</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="clientId"
                  value={order.clientId}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  id="button-addon2"
                  disabled={!order.clientId}
                  onClick={() => getClient(order.clientId)}
                >
                  Buscar cliente
                </Button>
              </InputGroup>
              {clientNotFound && <p className="text-danger">Cliente no encontrado</p>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="clientEmail"
                value={order.clientEmail}
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
                value={order.clientTelephone || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              name="clientObservation"
              value={order.clientObservation || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
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
                autoComplete="off"
                value={searchProductQuery}
                onChange={handleInputChange}
                required={orderProducts.length ? false : orderProduct.product ? false : true}
              />
              {orderProduct.price > 0 && (
                <p>
                  <b>Precio:</b> ${formatAmount(orderProduct.price)}
                </p>
              )}
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
              <Form.Label>Fecha y hora de entrega</Form.Label>
              <Form.Control
                type="datetime-local"
                name="deliver"
                value={formatToDatetimeLocal(orderProduct.deliver)}
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
                value={orderProduct.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y hora de devolución</Form.Label>
              <Form.Control
                type="datetime-local"
                name="return"
                value={orderProduct.return ? formatToDatetimeLocal(orderProduct.return) : ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Deposito</Form.Label>
              <Form.Control
                type="number"
                name="deposit"
                value={orderProduct.deposit || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación del producto</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={orderProduct.location || ''}
                disabled
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <GoogleMaps onLocationSelect={handleLocationSelect} />
        </Row>
        <br />
        {signUrl && <img src={signUrl} alt="Signature" />}
        <br />
        <br />
        <Button variant="success" style={{ marginRight: '1rem' }} onClick={handleAddNewProduct}>
          Añadir nuevo producto al pedido
        </Button>
        {!signUrl && (
          <Button variant="secondary" style={{ marginRight: '1rem' }} onClick={handleShow}>
            Firmar pedido
          </Button>
        )}
        <Modal show={show} onHide={handleShow}>
          {user && <QRSignature orderId={orderId} terms={user.orderTermsAndConditions} />}
          <Button style={{ width: '90%', margin: '1rem auto' }} variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal>

        <Button variant="primary" type="submit">
          Crear pedido
        </Button>
      </Form>

      <br />

      {orderProducts.length > 0 && (
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Depósito</th>
              <th>Fecha de devolución</th>
              <th>Días alquilados</th>
              <th>Valor total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderProducts.map((product, idx) => {
              const total = calculateTotalValue(product)

              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${formatAmount(product.price)}</td>
                  <td>{product.deposit ? `$${formatAmount(product.deposit)}` : '-'}</td>
                  <td>{product.return ? formatDate(product.return.toString()) : '-'}</td>
                  <td>{product.return ? diffDays(product.deliver, product.return) : '-'}</td>
                  <td>${formatAmount(total)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveProduct(product)}>
                      Borrar
                    </Button>
                  </td>
                </tr>
              )
            })}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Total: ${formatAmount(order.totalValue)}</b>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      )}

      <br />

      <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cliente ya registrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Nombre: {client?.name}</p>
            <p>Domicilio: {client?.address}</p>
            <p>Documento de Identidad: {client?.dni}</p>
            <p>Correo electrónico: {client?.email}</p>
            <p>Teléfono: {client?.phone}</p>
            <p>Observaciones:</p>
            <ul>
              {client?.observations?.map((observation, idx) => (
                <li key={idx}>{observation}</li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClientModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => fillExistingClientData(client)}>
            Rellenar datos
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
