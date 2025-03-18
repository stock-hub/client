import { Order } from './order.type'
import { Product } from './product.type'

enum ROLES {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Employee {
  name: string
  phone: number
  email: string
  role: ROLES
}

export interface User {
  _id: string
  username: string
  password: string
  logoUrl: string
  companyName: string
  companyDescription: string
  phone: number
  address: string
  nif: string
  tags: string[]
  orderTermsAndConditions: string
  additionalData?: Record<string, unknown>
  employees?: Employee[]
}

export interface Client {
  _id?: string
  name: string
  address: string
  dni: string
  email: string
  phone: number
  imgUrl?: string
  boughtProducts?: Product[]
  rentedProducts?: Product[]
  orders?: Order[]
}
