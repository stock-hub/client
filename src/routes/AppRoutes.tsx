import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export const AppRoutes: React.FC = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/dashboard/login' element={<LoginPage />} />
      {isLoggedIn ? (
        <>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/dashboard/products' element={<ProductsPage />} />
          <Route path='/dashboard/products/new' element={<NewProductPage />} />
          <Route
            path='/dashboard/products/:productId'
            element={<ViewProductPage />}
          />
          <Route path='/dashboard/invoices' element={<InvoicesPage />} />
        </>
      ) : (
        <Route path='*' element={<Navigate to='/dashboard/login' />} />
      )}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}
