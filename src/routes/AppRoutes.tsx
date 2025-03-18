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
import { OrdersPage } from '../pages/dashboard/OrdersPage/OrdersPage'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
import { EditProductPage } from '../pages/dashboard/EditProductPage/EditProductPage'
import { NewOrderPage } from '../pages/dashboard/NewOrderPage/NewOrderPage'
import { EachOrder } from '../components/dashboard/EachOrder/EachOrder'
import { SignaturePage } from '../pages/SignaturePage/SignaturePage'
import { SettingsPage } from '../pages/SettingsPage/SettingsPage'
import { ForgotPassword } from '../pages/ForgotPassword/ForgotPassword'
import { ChangePassword } from '../pages/ChangePassword/ChangePassword'

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
      <Route path="/orders" element={<PrivateRoute element={<OrdersPage />} />} />
      <Route path="/orders/new" element={<PrivateRoute element={<NewOrderPage />} />} />
      <Route path="/orders/sign" element={<SignaturePage />} />
      <Route path="/orders/:orderId" element={<PrivateRoute element={<EachOrder isDownload={false} />} />} />
      <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/change_password" element={<ChangePassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}
