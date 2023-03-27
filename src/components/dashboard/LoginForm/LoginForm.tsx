import { useContext, useState } from 'react'
import { AuthContext } from '../../../context/auth.context'
import { useNavigate } from 'react-router-dom'
import authService from '../../../services/auth.service'
import { Button, Form } from 'react-bootstrap'

interface ILoginForm {
  username: string
  password: string
}

interface ILoginResponse {
  data: {
    authToken: string
  }
}

export const LoginForm: React.FC = () => {
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    username: '',
    password: ''
  })

  const navigate = useNavigate()
  const { storeToken, authenticateUser } = useContext(AuthContext)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    authService
      .login(loginForm)
      .then((res: ILoginResponse) => {
        const { authToken } = res.data

        storeToken(authToken)
        authenticateUser()
        navigate('/dashboard')
      })
      .catch((err: Error) => console.error(err))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label>Username</Form.Label>
        <Form.Control type='text' name='username' value={loginForm.username} onChange={handleInputChange} required />
      </Form.Group>

      <Form.Group className='mb-3' controlId='formBasicPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          name='password'
          value={loginForm.password}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Button variant='primary' type='submit'>
        Log in
      </Button>
    </Form>
  )
}
