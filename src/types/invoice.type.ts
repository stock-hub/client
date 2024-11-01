import { Product } from './product.type'
import { User } from './user.type'

export interface InvoiceProduct {
  product: string | Product
  name: string
  quantity: number
  valuePerDay?: number
  return?: string
  deposit?: number
}

export interface Invoice {
  _id?: string
  user?: User
  products: InvoiceProduct[]
  totalValue: number
  deliver: string
  clientName: string
  clientAddress: string
  clientId: string
  clientEmail: string
  clientTelephone: number
  clientSignature?: string
  invoiceId?: string
  createdAt?: string
  updatedAt?: string
}

export interface InvoiceSignatureResponse {
  data: {
    signature: string
  }
}
