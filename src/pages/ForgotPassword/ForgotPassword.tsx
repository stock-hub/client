import React, { useContext, useState } from 'react'
import { Container } from 'react-bootstrap'
import authService from '../../services/auth.service'
import { MessageContext } from '../../context/userMessage.context'
import { AxiosError } from 'axios'
import { Input, SubmitBtn, SuccessEmail } from './ForgotPassword.styled'
import { UserMessage } from '../../components/UserMessage/UserMessage'

export const ForgotPassword: React.FC = () => {
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [changePasswordForm, setChangePasswordForm] = useState({ email: '' })
  const [emailSent, setEmailSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setChangePasswordForm({
      ...changePasswordForm,
      [name]: value
    })
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (changePasswordForm.email !== '') {
      try {
        await authService.requestChangePassword(changePasswordForm.email)
        setShowMessage(false)
        setEmailSent(true)
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const { message } = error.response.data
          setShowMessage(true)
          setMessageInfo(message)
        }
      }
    } else {
      setShowMessage(true)
      setMessageInfo('Enter a valid email.')
    }
  }

  return (
    <Container>
      <h1>Cambiar contraseña</h1>
      <p>Introduce tu email para cambiar tu contraseña</p>

      {!emailSent ? (
        <form onSubmit={handleFormSubmit}>
          <div className="form-floating mb-3">
            <Input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              name="email"
              value={changePasswordForm.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="floatingInput">Correo electrónico</label>
          </div>
          <SubmitBtn type="submit">Enviar</SubmitBtn>
        </form>
      ) : (
        <>
          <SuccessEmail>
            <p>Te hemos enviado un correo electrónico con las instrucciones para cambiar tu contraseña.</p>
          </SuccessEmail>
          <UserMessage />
        </>
      )}
    </Container>
  )
}
