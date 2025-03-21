export interface Maintenance {
  id: string
  date: Date
  description: string
  personInCharge: string
}

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
  maintenance?: Maintenance[]
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
