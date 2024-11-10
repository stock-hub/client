import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../pages/dashboard/DashboardPage/DashboardPage'
import { AuthContext } from '../context/auth.context'
import { LoginPage } from '../pages/dashboard/LoginPage/LoginPage'
import { NewProductPage } from '../pages/dashboard/NewProductPage/NewProductPage'
import { ProductsPage } from '../pages/dashboard/ProductsPage/ProductsPage'
import { ViewProductPage } from '../pages/dashboard/ViewProductPage/ViewProductPage'
import { HomePage } from '../pages/HomePage/HomePage'
import { PageNotFound } from '../pages/PageNotFound/PageNotFound'
import { InvoicesPage } from '../pages/dashboard/InvoicesPage/InvoicesPage'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
import { EditProductPage } from '../pages/dashboard/EditProductPage/EditProductPage'
import { NewInvoicePage } from '../pages/dashboard/NewInvoicePage/NewInvoicePage'
import { EachInvoice } from '../components/dashboard/EachInvoice/EachInvoice'
import { SignaturePage } from '../pages/SignaturePage/SignaturePage'

export const AppRoutes: React.FC = () => {
  const { isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
      <Route path="/products" element={<PrivateRoute element={<ProductsPage />} />} />
      <Route path="/products/new" element={<PrivateRoute element={<NewProductPage />} />} />
      <Route path="/products/:productId" element={<PrivateRoute element={<ViewProductPage />} />} />
      <Route path="/products/:productId/edit" element={<PrivateRoute element={<EditProductPage />} />} />
      <Route path="/invoices" element={<PrivateRoute element={<InvoicesPage />} />} />
      <Route path="/invoices/new" element={<PrivateRoute element={<NewInvoicePage />} />} />
      <Route path="/invoices/sign" element={<SignaturePage />} />
      <Route path="/invoices/:invoiceId" element={<PrivateRoute element={<EachInvoice isDownload={false} />} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}
