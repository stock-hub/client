import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { NavBar } from './components/NavBar/NavBar'
import { UserMessage } from './components/UserMessage/UserMessage'
import { AppRoutes } from './routes/AppRoutes'

export const App: React.FC = () => {
  const excludedRoute = '/'

  return (
    <>
      {!excludedRoute.includes(window.location.pathname) && <NavBar />}
      <AppRoutes />
      <UserMessage />
    </>
  )
}
