import { useCallback, useEffect, useState } from 'react'
import { Invoice } from '../../../types/invoice.type'
import invoiceService from '../../../services/invoice.service'
import { useSearchParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { InvoicePDF } from '../../InvoicePDF/InvoicePdf'

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
      {invoicesList?.map((invoice, idx) => {
        return (
          <div key={idx}>
            <div>
              <p>Producto: {typeof invoice.product === 'string' ? invoice.product : invoice.product.name}</p>
              <p>Cliente: {invoice.clientName}</p>
              <p>Cliente Documento Identidad: {invoice.clientId}</p>
              <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName={`${invoice.fileId}.pdf`}>
                <span>Descargar PDF</span>
              </PDFDownloadLink>
            </div>
            <br />
          </div>
        )
      })}
    </Container>
  )
}
