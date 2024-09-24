import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { Invoice } from '../../types/invoice.type'

export const InvoicePDF: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    header: { fontSize: 20, marginBottom: 10 },
    text: { fontSize: 12 }
  })

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Factura</Text>
        </View>
        <View style={styles.section}>
          <Text>Producto: {typeof invoice.product === 'string' ? invoice.product : invoice.product.name}</Text>
          <Text>Cantidad: {invoice.quantity}</Text>
          {invoice.valuePerDay && <Text>Valor por día: ${invoice.valuePerDay}</Text>}
          <Text>Valor total: ${invoice.totalValue}</Text>
          {invoice.deposit && <Text>Depósito: {invoice.deposit}$</Text>}
          <Text>Fecha de entrega: {invoice.deliver.toLocaleString()}</Text>
          {invoice.return && <Text>Fecha de devolución: {invoice.return.toLocaleString()}</Text>}
        </View>
        <View style={styles.section}>
          <Text>Cliente: {invoice.clientName}</Text>
          <Text>Domicilio: {invoice.clientAddress}</Text>
          <Text>Documento de Identidad: {invoice.clientId}</Text>
          <Text>Teléfono: {invoice.clientTelephone}</Text>
        </View>
      </Page>
    </Document>
  )
}
