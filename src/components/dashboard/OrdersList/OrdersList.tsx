import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import cloudFilesService from '../../../services/cloud_files.service'
import orderService from '../../../services/order.service'
import { Order } from '../../../types/order.type'

interface OrdersResponse {
  orders: Order[]
  total_pages: number
}

export const OrdersList: React.FC = () => {
  const [ordersList, setOrdersList] = useState<Order[]>([])
  const [_totalPages, setTotalPages] = useState<number>(1)
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [query] = useState<string>(searchParams.get('query') || '')
  const [isRentedCheck] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const [checkedButtons, setCheckedButtons] = useState<{ [key: string]: boolean }>({})

  const fetchOrders = useCallback((page: number, query: string, isRented: boolean) => {
    orderService
      .getOrdersList(page, query, isRented)
      .then(({ data }: { data: OrdersResponse }) => {
        setOrdersList(data.orders)
        setTotalPages(data.total_pages)
      })
      .catch((error: Error) => console.error(error))
  }, [])

  useEffect(() => {
    fetchOrders(page, query, isRentedCheck)
  }, [])

  const downloadOrder = async (orderId: string) => {
    try {
      const response = await cloudFilesService.downloadFile(orderId)

      if (response.status !== 200) {
        throw new Error(`Error al descargar el archivo: ${response.status} ${response.statusText}`)
      }

      const fileName = `${orderId}.pdf`

      const blob = new Blob([response.data], { type: 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  const removeOrder = (orderId: string) => {
    orderService
      .deleteOrder(orderId)
      .then(() => {
        cloudFilesService.deleteFile(orderId)
        const updatedOrders = ordersList.filter((order) => order.orderId !== orderId)

        setOrdersList(updatedOrders)
      })
      .catch((error: Error) => console.error(error))
  }

  const sendByEmail = (orderId: string) => {
    orderService
      .sendByEmail(orderId)
      .then(() => {
        setCheckedButtons((prev) => ({ ...prev, [orderId]: true }))

        setTimeout(() => {
          setCheckedButtons((prev) => ({ ...prev, [orderId]: false }))
        }, 2000)
      })
      .catch((error: Error) => console.error(error))
  }

  return (
    <Container>
      {user &&
        ordersList &&
        ordersList.map((order, idx) => {
          return (
            <div key={idx}>
              <div>
                <p>Pedido nº: {order.orderId}</p>
                <p>Cliente: {order.clientName}</p>
                <p>Documento Identidad: {order.clientId}</p>
                <Link className="btn btn-secondary" to={`/orders/${order._id}`}>
                  Ver
                </Link>
                <Button style={{ marginLeft: '1rem' }} onClick={() => downloadOrder(order.orderId!)}>
                  Descargar PDF
                </Button>
                <Button style={{ marginLeft: '1rem' }} variant="success" onClick={() => sendByEmail(order.orderId!)}>
                  {checkedButtons[order.orderId!] ? <i className="fa-solid fa-check"></i> : 'Enviar por correo'}
                </Button>
                <Button style={{ marginLeft: '1rem' }} variant="danger" onClick={() => removeOrder(order.orderId!)}>
                  Borrar pedido
                </Button>
              </div>
              <br />
            </div>
          )
        })}
    </Container>
  )
}
