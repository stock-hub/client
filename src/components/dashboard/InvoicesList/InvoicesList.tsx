import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import cloudFilesService from '../../../services/cloud_files.service'
import invoiceService from '../../../services/invoice.service'
import { Invoice } from '../../../types/invoice.type'

interface InvoicesResponse {
  invoices: Invoice[]
  total_pages: number
}

export const InvoicesList: React.FC = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [_totalPages, setTotalPages] = useState<number>(1)
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [query] = useState<string>(searchParams.get('query') || '')
  const [isRentedCheck] = useState<boolean>(false)
  const { user } = useContext(AuthContext)

  const fetchInvoices = useCallback((page: number, query: string, isRented: boolean) => {
    invoiceService
      .getInvoicesList(page, query, isRented)
      .then(({ data }: { data: InvoicesResponse }) => {
        setInvoicesList(data.invoices)
        setTotalPages(data.total_pages)
      })
      .catch((err: Error) => console.error(err))
  }, [])

  useEffect(() => {
    fetchInvoices(page, query, isRentedCheck)
  }, [])

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await cloudFilesService.downloadFile(invoiceId)

      if (response.status !== 200) {
        throw new Error(`Error al descargar el archivo: ${response.status} ${response.statusText}`)
      }

      const fileName = `${invoiceId}.pdf`

      const blob = new Blob([response.data], { type: 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  const removeInvoice = (invoiceId: string) => {
    invoiceService
      .deleteInvoice(invoiceId)
      .then(() => {
        cloudFilesService.deleteFile(invoiceId)
        const updatedInvoices = invoicesList.filter((invoice) => invoice.invoiceId !== invoiceId)

        setInvoicesList(updatedInvoices)
      })
      .catch((err: Error) => console.error(err))
  }

  return (
    <Container>
      {user &&
        invoicesList &&
        invoicesList.map((invoice, idx) => {
          return (
            <div key={idx}>
              <div>
                <p>Factura nº: {invoice.invoiceId}</p>
                <p>Cliente: {invoice.clientName}</p>
                <p>Documento Identidad: {invoice.clientId}</p>
                <Link className="btn btn-secondary" to={`/invoices/${invoice._id}`}>
                  Ver
                </Link>
                <Button style={{ marginLeft: '1rem' }} onClick={() => downloadInvoice(invoice.invoiceId!)}>
                  Descargar PDF
                </Button>
                <Button
                  style={{ marginLeft: '1rem' }}
                  variant="danger"
                  onClick={() => removeInvoice(invoice.invoiceId!)}
                >
                  Borrar factura
                </Button>
              </div>
              <br />
            </div>
          )
        })}
    </Container>
  )
}
