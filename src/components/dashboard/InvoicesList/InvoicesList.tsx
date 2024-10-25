import { PDFDownloadLink } from '@react-pdf/renderer'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import invoiceService from '../../../services/invoice.service'
import { Invoice } from '../../../types/invoice.type'
import { EachInvoicePDF } from '../EachInvoicePDF/EachInvoicePDF'

interface InvoicesResponse {
  invoices: Invoice[]
  total_pages: number
}

export const InvoicesList: React.FC = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [query, setQuery] = useState<string>(searchParams.get('query') || '')
  const [isRentedCheck, setIsRentedCheck] = useState<boolean>(false)
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
                <p>Cliente Documento Identidad: {invoice.clientId}</p>
                <PDFDownloadLink
                  document={<EachInvoicePDF invoice={invoice} user={user} />}
                  fileName={`${invoice.invoiceId}.pdf`}
                >
                  <span>Descargar PDF</span>
                </PDFDownloadLink>
                <br />
                <Link to={`/dashboard/invoices/${invoice._id}`}>Ver</Link>
              </div>
              <br />
            </div>
          )
        })}
    </Container>
  )
}
