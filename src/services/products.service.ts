import axios, { AxiosRequestConfig } from 'axios'
import { Product } from '../types/product.type'

class ProductService {
  axios: any

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/products`
    })

    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` }
      }

      return config
    })
  }

  getAllProducts(search_query: string) {
    return this.axios.get(`/filter/${search_query}`)
  }

  getProductsList(page: number) {
    return this.axios.get(`/${page}`)
  }

  getProduct(productId: string) {
    return this.axios.get(`/${productId}/view`)
  }

  newProduct(product: Product) {
    return this.axios.post('/new', product)
  }

  deleteProduct(productId: string) {
    return this.axios.delete(`/${productId}/delete`)
  }
}

const productService = new ProductService()

export default productService
