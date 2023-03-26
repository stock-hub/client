export interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: Array<string>
  tags: Array<string>
  onSell: string
}

export interface INewProduct {
  name: string
  description: string
  price: string
  imageUrl: Array<string>
  tags: Array<string>
  onSell: string
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
