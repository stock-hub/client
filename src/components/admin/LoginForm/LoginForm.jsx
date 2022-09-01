import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth.context"
import { useNavigate } from "react-router-dom"
import authService from "../../../services/auth.service"
import { Button, Form } from "react-bootstrap"

const LoginForm = () => {

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()
    const { storeToken, authenticateUser } = useContext(AuthContext)

    const handleInputChange = e => {
        const { name, value } = e.target
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        authService
            .login(loginForm)
            .then(({ data }) => {
                storeToken(data.authToken)
                authenticateUser()
                navigate('/')
            })
            .catch(err => console.log(err))
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={loginForm.username}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Enviar
            </Button>
        </Form>
    )
}

export default LoginForm