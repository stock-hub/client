import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isLoading, isLoggedIn } = useContext(AuthContext)
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return <>{element}</>
}

export default PrivateRoute
