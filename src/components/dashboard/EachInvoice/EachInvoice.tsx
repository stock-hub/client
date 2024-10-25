import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import invoiceService from '../../../services/invoice.service'
import { Invoice } from '../../../types/invoice.type'
import { formatDate } from '../../../utils/tools'
import {
  CompanyAddress,
  Container,
  Divider,
  Footer,
  Header,
  InvoiceDetails,
  InvoiceProducts,
  UsersInfo
} from './EachInvoice.styled'
import { Product } from '../../../types/product.type'

export const EachInvoice: React.FC<{ isDownload: boolean }> = ({ isDownload = false }) => {
  const { user } = useContext(AuthContext)
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined)
  const { invoiceId } = useParams<string>()

  useEffect(() => {
    invoiceService
      .getInvoice(invoiceId as string)
      .then(({ data }: { data: Invoice }) => setInvoice(data))
      .catch((err: Error) => console.error(err))
  }, [invoiceId])

  return (
    user &&
    invoice && (
      <Container $download={isDownload}>
        <Header>
          <img src={user.logoUrl} alt="Company logo" />
          <div>
            <b>{user.companyName}</b>
            <p>{user.companyDescription}</p>
          </div>
        </Header>
        <Divider />
        <UsersInfo>
          <div>
            <b>{user.companyName}</b>
            <CompanyAddress>{user.address}</CompanyAddress>
            <p>{user.phone}</p>
            <p>{user.nif}</p>
          </div>
          <div>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientId}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientTelephone}</p>
          </div>
        </UsersInfo>
        <Divider />
        <InvoiceDetails>
          <p>
            <b>Nº factura:</b> {invoice.invoiceId}
          </p>
          <p>
            <b>Fecha:</b> {formatDate(invoice.deliver)}
          </p>
        </InvoiceDetails>
        <Divider />
        <InvoiceProducts>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product, idx) => {
              const total = (product.product as Product).price * product.quantity

              return (
                <tr key={idx}>
                  <td>{product.quantity}</td>
                  <td>{product.name}</td>
                  <td>$ {(product.product as Product).price}</td>
                  <td>$ {total}</td>
                </tr>
              )
            })}
            <tr style={{ borderTop: '1px solid #ccc' }}>
              <td></td>
              <td></td>
              <td></td>
              <td>$ {invoice.totalValue}</td>
            </tr>
          </tbody>
        </InvoiceProducts>
        <Divider />
        <Footer>
          <a href="cyrequiposyconstrucciones.com">cyrequiposyconstrucciones.com</a>
          <p>Página: 1/1</p>
        </Footer>
      </Container>
    )
  )
}
