import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Invoice } from '../types/invoice.type'

class InvoiceService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/invoices`
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

  getInvoicesList(page: number, query: string, isRented: boolean) {
    return this.axios.get(`/${page}`, {
      params: { query, isRented }
    })
  }

  getInvoice(invoiceId: string) {
    return this.axios.get<Invoice>(`/${invoiceId}/view`)
  }

  newInvoice(invoice: Invoice) {
    return this.axios.post('/new', invoice)
  }

  newSignature(invoiceId: string, signature: string) {
    return this.axios.post(`/${invoiceId}/sign`, { signature })
  }

  getSignature(invoiceId: string) {
    return this.axios.get(`/${invoiceId}/sign/view`)
  }

  deleteInvoice(invoiceId: string) {
    return this.axios.delete(`/${invoiceId}/delete`)
  }
}

const invoiceService = new InvoiceService()

export default invoiceService
