import React from 'react'
import LoginForm from '../../../components/dashboard/LoginForm/LoginForm'
import { Container } from 'react-bootstrap'

export const LoginPage: React.FC = () => {
  return (
    <Container>
      <h1>Iniciar sesión</h1>
      <LoginForm />
    </Container>
  )
}
