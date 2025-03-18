import { Order } from './order.type'
import { Product } from './product.type'

export interface Client {
  _id?: string
  name: string
  address: string
  dni: string
  phone: number
  email: string
  imgUrl?: string
  boughtProducts: Product[]
  rentedProducts: Product[]
  orders: Order[]
  observations?: string[]
  createdAt: Date
  updatedAt: Date
}
