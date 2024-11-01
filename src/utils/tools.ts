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

export function generateInvoiceId() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const bytes = new Uint8Array(9)

  window.crypto.getRandomValues(bytes)

  for (let i = 0; i < bytes.length; i++) {
    result += charset[bytes[i] % charset.length]
  }

  return result
}
