import React from 'react'
import Container from 'react-bootstrap/Container'
import { LoginForm } from '../../../components/dashboard/LoginForm/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <Container>
      <h1>Iniciar sesión</h1>
      <LoginForm />
    </Container>
  )
}
