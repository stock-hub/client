import { Product } from './product.type'
import { User } from './user.type'

export interface OrderProduct {
  product: string | Product
  name: string
  price: number
  quantity: number
  deliver: Date
  return?: Date
  deposit?: number
  location?: string
}

export interface Order {
  _id?: string
  user?: User
  products: OrderProduct[]
  totalValue: number
  clientName: string
  clientAddress: string
  clientId: string
  clientEmail: string
  clientTelephone: number
  clientSignature?: string
  clientObservation?: string
  orderId?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderSignatureResponse {
  data: {
    signature: string
  }
}
