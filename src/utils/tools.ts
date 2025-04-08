import { OrderProduct } from '../types/order.type'

export function titleize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatStr(str: string): string {
  return str.split('_').join(' ')
}

export function formatDate(dateString?: string, form: boolean = false): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hour = date.getHours()
  const minutes = date.getMinutes()

  return form ? `${year}-${month}-${day}` : `${day}/${month}/${year} ${hour}:${minutes}`
}

export function formatToDatetimeLocal(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function generateOrderId() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const bytes = new Uint8Array(9)

  window.crypto.getRandomValues(bytes)

  for (let i = 0; i < bytes.length; i++) {
    result += charset[bytes[i] % charset.length]
  }

  return result
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function diffDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d1.getTime() - d2.getTime())

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateTotalValue(orderProduct: OrderProduct, orderProducts?: OrderProduct[]) {
  const calc = (product: OrderProduct) =>
    product.quantity *
    (product.return
      ? product.price * diffDays(product.deliver, product.return)
      : product.price + (product.deposit || 0))

  return orderProducts
    ? orderProducts.reduce((acc, product) => acc + calc(product), 0) + calc(orderProduct)
    : calc(orderProduct)
}
