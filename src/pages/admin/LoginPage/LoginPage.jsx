import { Container } from "react-bootstrap"
import LoginForm from "../../../components/admin/LoginForm/LoginForm"


const LoginPage = () => {
    return (
        <Container>
            <h1>Iniciar sesión</h1>
            <LoginForm />
        </Container>
    )
}

export default LoginPage