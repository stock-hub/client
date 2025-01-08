import { useContext, useState } from 'react'
import { AuthContext } from '../../../context/auth.context'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { ActionButtons, LoginFormError } from './LoginForm.styled'

interface LoginFormFields {
  username: string
  password: string
}

export const LoginForm: React.FC = () => {
  const [loginFormFields, setLoginFormFields] = useState<LoginFormFields>({
    username: '',
    password: ''
  })

  const navigate = useNavigate()
  const location = useLocation()
  const { logInUser, authError, showError } = useContext(AuthContext)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginFormFields({
      ...loginFormFields,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await logInUser(loginFormFields.username, loginFormFields.password)

    const from = location.state?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={loginFormFields.username}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={loginFormFields.password}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      {showError && (
        <LoginFormError>
          <p>{authError}</p>
        </LoginFormError>
      )}
      <ActionButtons>
        <Button variant="primary" type="submit">
          Log in
        </Button>
        <Link to="/forgot_password">¿Has olvidado tu contraseña?</Link>
      </ActionButtons>
    </Form>
  )
}
