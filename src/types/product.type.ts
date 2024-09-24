export interface Product {
  _id?: string
  name: string
  description: string
  price: string
  imageUrl: Array<string>
  tags: Array<string>
  onSell: string
  inStock: string
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
