import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Order } from '../types/order.type'

class OrderService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/orders`
    })

    this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        if (config.headers instanceof AxiosHeaders) {
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        } else {
          config.headers = new AxiosHeaders()
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        }
      }

      return config
    })
  }

  getOrdersList(page: number, query: string, isRented: boolean) {
    return this.axios.get(`/${page}`, {
      params: { query, isRented }
    })
  }

  getOrder(orderId: string) {
    return this.axios.get<Order>(`/${orderId}/view`)
  }

  newOrder(order: Order) {
    return this.axios.post('/new', order)
  }

  newSignature(orderId: string, signature: string) {
    return this.axios.post(`/${orderId}/sign`, { signature })
  }

  getSignature(orderId: string) {
    return this.axios.get(`/${orderId}/sign/view`)
  }

  deleteOrder(orderId: string) {
    return this.axios.delete(`/${orderId}/delete`)
  }

  sendByEmail(orderId: string) {
    return this.axios.post(`/${orderId}/send_email`)
  }
}

const orderService = new OrderService()

export default orderService
