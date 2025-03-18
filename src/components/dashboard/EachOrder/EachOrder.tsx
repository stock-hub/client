import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import orderService from '../../../services/order.service'
import { Order } from '../../../types/order.type'
import { formatDate } from '../../../utils/tools'
import {
  CompanyAddress,
  Container,
  Divider,
  Footer,
  Header,
  OrderDetails,
  OrderProducts,
  UsersInfo
} from './EachOrder.styled'
import { Product } from '../../../types/product.type'
import { Button } from 'react-bootstrap'

export const EachOrder: React.FC<{ isDownload: boolean }> = ({ isDownload = false }) => {
  const { user } = useContext(AuthContext)
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const { orderId } = useParams<string>()
  const navigate = useNavigate()

  useEffect(() => {
    orderService
      .getOrder(orderId as string)
      .then(({ data }: { data: Order }) => setOrder(data))
      .catch((error: Error) => console.error(error))
  }, [orderId])

  return (
    user &&
    order && (
      <Container $download={isDownload}>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Header>
          <img src={user.logoUrl} alt="Company logo" />
          <div>
            <b>{user.companyName}</b>
            <p>{user.companyDescription}</p>
          </div>
        </Header>
        <Divider />
        <UsersInfo>
          <div>
            <b>{user.companyName}</b>
            <CompanyAddress>{user.address}</CompanyAddress>
            <p>{user.phone}</p>
            <p>{user.nif}</p>
          </div>
          <div>
            <p>{order.clientName}</p>
            <p>{order.clientId}</p>
            <p>{order.clientAddress}</p>
            <p>{order.clientTelephone}</p>
          </div>
        </UsersInfo>
        <Divider />
        <OrderDetails>
          <p>
            <b>Nº pedido:</b> {order.orderId}
          </p>
          <p>
            <b>Fecha:</b> {formatDate(order.deliver)}
          </p>
        </OrderDetails>
        <Divider />
        <OrderProducts>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, idx) => {
              const total = (product.product as Product).price * product.quantity

              return (
                <tr key={idx}>
                  <td>{product.quantity}</td>
                  <td>{product.name}</td>
                  <td>$ {(product.product as Product).price}</td>
                  <td>$ {total}</td>
                </tr>
              )
            })}
            <tr style={{ borderTop: '1px solid #ccc' }}>
              <td></td>
              <td></td>
              <td></td>
              <td>$ {order.totalValue}</td>
            </tr>
          </tbody>
        </OrderProducts>
        <Divider />
        <Footer>
          <a href="cyrequiposyconstrucciones.com">cyrequiposyconstrucciones.com</a>
          <p>Página: 1/1</p>
        </Footer>
      </Container>
    )
  )
}
