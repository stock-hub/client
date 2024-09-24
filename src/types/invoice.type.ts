import { Product } from './product.type'

export interface Invoice {
  _id?: string
  user?: {
    _id?: string
    username: string
    password: string
    logoUrl: string
    companyName: string
    phone: number
    address: string
    nif: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
  }
  product: Product | string
  quantity: number
  valuePerDay?: number
  totalValue: number
  deposit?: number
  deliver: Date
  return?: Date
  clientName: string
  clientAddress: string
  clientId: string
  clientTelephone: number | string
  fileId: string
  createdAt?: Date
  updatedAt?: Date
}
