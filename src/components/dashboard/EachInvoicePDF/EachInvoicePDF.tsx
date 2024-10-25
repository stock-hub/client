import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { Invoice } from '../../../types/invoice.type'
import { User } from '../../../types/user.type'
import { formatDate } from '../../../utils/tools'
import { pdfStyles as styles } from './EachInvoicePDF.styles'
import { Product } from '../../../types/product.type'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/normal.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/bold.ttf', fontWeight: 700 }
  ]
})

export const EachInvoicePDF: React.FC<{ invoice: Invoice; user: User; signUrl: string }> = ({
  invoice,
  user,
  signUrl
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.container}>
        <View style={styles.header}>
          <Image src={user.logoUrl} style={styles.headerImg} />
          <View style={styles.headerText}>
            <Text>{user.companyDescription}</Text>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.usersInfo}>
          <View>
            <Text>{user.companyName}</Text>
            <Text style={styles.companyAddress}>{user.address}</Text>
            <Text>{user.phone}</Text>
            <Text>{user.nif}</Text>
          </View>
          <View>
            <Text>{invoice.clientName}</Text>
            <Text>{invoice.clientId}</Text>
            <Text>{invoice.clientAddress}</Text>
            <Text>{invoice.clientTelephone}</Text>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceDetailsText}>Nº factura: {invoice.invoiceId}</Text>
          <Text style={styles.invoiceDetailsText}>Fecha: {formatDate(invoice.deliver)}</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.invoiceProducts}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Cantidad</Text>
            <Text style={styles.headerCellWide}>Descripción</Text>
            <Text style={styles.headerCellSmall}>Precio</Text>
            <Text style={styles.headerCellSmallTotal}>Total</Text>
          </View>
          {invoice.products.map((product, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.cell}>{product.quantity}</Text>
              <Text style={styles.cellWide}>{product.name}</Text>
              <Text style={styles.cellSmall}>$ {(product.product as Product).price}</Text>
              <Text style={styles.cellSmall}>$ {(product.product as Product).price * product.quantity}</Text>
            </View>
          ))}
          <View style={styles.tableRowTotal}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cellWide}></Text>
            <Text style={styles.cellSmall}></Text>
            <Text style={styles.cellSmall}>$ {invoice.totalValue}</Text>
          </View>
        </View>
        <Image source={signUrl} style={styles.signature} />
        <View style={styles.footer}>
          <View style={styles.divider}></View>
          <Text style={styles.footerLink}>cyrequiposyconstrucciones.com</Text>
          <Text>Página: 1/1</Text>
        </View>
      </Page>
    </Document>
  )
}
