import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Product } from '../types/product.type'

class ProductService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/products`
    })

    this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        if (config.headers instanceof AxiosHeaders) {
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        } else {
          config.headers = new AxiosHeaders()
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        }
      }

      return config
    })
  }

  getAllProducts(search_query: string) {
    return this.axios.get(`/filter/${search_query}`)
  }

  getProductsList(page: number, query: string, tags: string) {
    return this.axios.get(`/${page}`, {
      params: { query, tags }
    })
  }

  getProduct(productId: string) {
    return this.axios.get(`/${productId}/view`)
  }

  newProduct(product: Product) {
    return this.axios.post('/new', product)
  }

  editProduct(productId: string, product: Product) {
    return this.axios.put(`/${productId}/edit`, product)
  }

  deleteProduct(productId: string) {
    return this.axios.delete(`/${productId}/delete`)
  }
}

const productService = new ProductService()

export default productService
