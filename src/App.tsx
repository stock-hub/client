import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { NavBar } from './components/NavBar/NavBar'
import { UserMessage } from './components/UserMessage/UserMessage'
import { AppRoutes } from './routes/AppRoutes'

export const App: React.FC = () => {
  const excludedRoutes = ['/', '/invoices/sign']

  return (
    <>
      {!excludedRoutes.includes(window.location.pathname) && <NavBar />}
      <AppRoutes />
      <UserMessage />
    </>
  )
}
