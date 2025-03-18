import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { Order } from '../../../types/order.type'
import { User } from '../../../types/user.type'
import { formatDate } from '../../../utils/tools'
import { pdfStyles as styles } from './EachOrderPDF.styles'
import { Product } from '../../../types/product.type'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/normal.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/bold.ttf', fontWeight: 700 }
  ]
})

export const EachOrderPDF: React.FC<{ order: Order; user: User; signUrl: string }> = ({ order, user, signUrl }) => {
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
            <Text>{order.clientName}</Text>
            <Text>{order.clientId}</Text>
            <Text>{order.clientAddress}</Text>
            <Text>{order.clientTelephone}</Text>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailsText}>Nº pedido: {order.orderId}</Text>
          <Text style={styles.orderDetailsText}>Fecha: {formatDate(order.deliver)}</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.orderProducts}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Cantidad</Text>
            <Text style={styles.headerCellWide}>Descripción</Text>
            <Text style={styles.headerCellSmall}>Precio</Text>
            <Text style={styles.headerCellSmallTotal}>Total</Text>
          </View>
          {order.products.map((product, idx) => (
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
            <Text style={styles.cellSmall}>$ {order.totalValue}</Text>
          </View>
        </View>
        <View style={styles.signature}>
          <Image source={signUrl} style={styles.signatureImage} />
          <Text style={styles.signatureClientId}>{order.clientId}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.divider}></View>
          <Text style={styles.footerLink}>cyrequiposyconstrucciones.com</Text>
          <Text>Página: 1/1</Text>
        </View>
      </Page>
    </Document>
  )
}
