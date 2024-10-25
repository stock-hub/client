import axios, { AxiosRequestConfig } from 'axios'
import { Invoice } from '../types/invoice.type'

class InvoiceService {
  axios: any

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/invoices`
    })

    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` }
      }

      return config
    })
  }

  getInvoicesList(page: number, query: string, isRented: boolean) {
    return this.axios.get(`/${page}`, {
      params: { query, isRented }
    })
  }

  getInvoice(invoiceId: string) {
    return this.axios.get(`/${invoiceId}/view`)
  }

  newInvoice(invoice: Invoice) {
    return this.axios.post('/new', invoice)
  }
}

const invoiceService = new InvoiceService()

export default invoiceService
