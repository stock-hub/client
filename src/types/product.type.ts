import { Maintenance } from './maintenance.type'
import { User } from './user.type'

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  imageUrl: Array<string>
  tags: Array<string>
  onSell: boolean
  inStock: boolean
  quantity: number
  maintenance?: Maintenance[] | string[]
  user?: User
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductContextProps {
  productsList: Product[]
  page: number
  totalPages: number
  setProductsList: React.Dispatch<React.SetStateAction<Product[]>>
  getProducts: () => void
  changePage: (num: number) => void
  deleteProduct: (id: string) => void
}

export interface ProductListResponse {
  products: Product[]
  total_pages: number
}

export type ProductResponse = Product[]
