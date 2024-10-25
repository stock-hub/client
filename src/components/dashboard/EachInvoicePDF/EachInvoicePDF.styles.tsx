import { StyleSheet } from '@react-pdf/renderer'

export const pdfStyles = StyleSheet.create({
  container: {
    width: '80%',
    margin: '0 auto',
    fontFamily: 'Helvetica',
    fontSize: '10px'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  headerImg: {
    width: '30%'
  },
  headerText: {
    width: '35%'
  },
  divider: {
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 'auto'
  },
  usersInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  companyAddress: {
    width: '100%'
  },
  invoiceDetails: {
    flexDirection: 'row',
    width: '90%',
    padding: 10,
    marginHorizontal: 'auto'
  },
  invoiceDetailsText: {
    marginRight: 20
  },
  invoiceProducts: {
    width: '90%',
    margin: '0 auto',
    marginVertical: 10
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 5
  },
  tableRowTotal: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopColor: '#000',
    paddingVertical: 5
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
    paddingHorizontal: 5
  },
  headerCellWide: {
    flex: 4,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
    paddingHorizontal: 5
  },
  headerCellSmall: {
    flex: 0.75,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
    paddingHorizontal: 5
  },
  headerCellSmallTotal: {
    flex: 0.75,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'left',
    paddingHorizontal: 5
  },
  cellWide: {
    flex: 4,
    fontSize: 12,
    textAlign: 'left',
    paddingHorizontal: 5
  },
  cellSmall: {
    flex: 0.75,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5
  },
  signature: {
    width: '250px',
    marginTop: 20,
    marginRight: 20,
    alignSelf: 'flex-end'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
    paddingBottom: 10
  },
  footerLink: {
    textDecoration: 'none',
    color: 'black'
  }
})
