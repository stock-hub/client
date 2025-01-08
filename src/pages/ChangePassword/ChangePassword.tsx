import React, { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { Container } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MessageContext } from '../../context/userMessage.context'
import authService from '../../services/auth.service'
import {
  ChangePasswordDiv,
  ChangePasswordGroup,
  ChangePasswordInput,
  NotMatchPass,
  ShowPasswordButton,
  SubmitBtn
} from './ChangePassword.styled'

export const ChangePassword: React.FC = () => {
  const [changePasswordForm, setChangePasswordForm] = useState({
    new_password: ''
  })
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [disabled, setDisabled] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false)
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false)
  const [idParams] = useSearchParams({ id: '' })

  const navigate = useNavigate()
  const togglePassword = () => setPasswordShown(!passwordShown)
  const toggleConfirmPassword = () => setConfirmPasswordShown(!confirmPasswordShown)
  const hashId = idParams.get('id')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setChangePasswordForm({
      ...changePasswordForm,
      [name]: value
    })
  }

  useEffect(() => {
    if (!hashId) {
      navigate('/forgot_password')
    }
  }, [hashId, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await authService.changePassword({ password: changePasswordForm.new_password, hash: hashId! })

      navigate('/')
      setShowMessage(true)
      setMessageInfo('Your password has been change')
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const { message } = error.response.data
        setShowMessage(true)
        setMessageInfo(message)
      }
    }
  }

  const passwordMatch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changePasswordForm.new_password === '') {
      setDisabled(false)
    } else if (e.target.value !== changePasswordForm.new_password) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }

  return (
    <Container>
      <h1>Cambiar contraseña</h1>
      <p>Introduce tu nueva contraseña.</p>

      <form onSubmit={handleSubmit}>
        <ChangePasswordGroup className="mb-3">
          <ChangePasswordDiv className="form-floating">
            <ChangePasswordInput
              type={passwordShown ? 'text' : 'password'}
              className="form-control"
              id="changePasswordInput"
              placeholder="Password"
              name="new_password"
              value={changePasswordForm.new_password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            <label htmlFor="changePasswordInput">New password</label>
          </ChangePasswordDiv>
          <ShowPasswordButton type="button" onClick={togglePassword}>
            {passwordShown ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
          </ShowPasswordButton>
        </ChangePasswordGroup>

        <ChangePasswordGroup className="mb-3">
          <ChangePasswordDiv className="form-floating">
            <ChangePasswordInput
              type={confirmPasswordShown ? 'text' : 'password'}
              className="form-control"
              id="confirmPasswordInput"
              placeholder="Confirm password"
              autoComplete="new-password"
              onChange={passwordMatch}
              required
            />
            <label htmlFor="confirmPasswordInput">Confirm new password</label>
          </ChangePasswordDiv>
          <ShowPasswordButton type="button" onClick={toggleConfirmPassword}>
            {confirmPasswordShown ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
          </ShowPasswordButton>
        </ChangePasswordGroup>
        <NotMatchPass>{disabled ? 'Passwords does not match' : ''}</NotMatchPass>

        <SubmitBtn type="submit">Submit</SubmitBtn>
      </form>
    </Container>
  )
}
