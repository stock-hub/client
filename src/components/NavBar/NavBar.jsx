import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { AuthContext } from "../../context/auth.context"
import './NavBar.css'

const NavBar = () => {

    const { isLoggedIn, logOutUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const navigation = () => {
        navigate("/admin/login")
    }
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>La2da</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/admin/login">Login</Nav.Link>
                        {
                            isLoggedIn &&
                            <>
                                <NavDropdown title="Admin" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/admin">Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item href="/admin/productos?page=1">Productos</NavDropdown.Item>
                                    <NavDropdown.Item href="/admin/recibos">Facturas</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item className="logout" onClick={() => {
                                        logOutUser()
                                        navigation()
                                    }}>
                                        Cerrar sesión
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default NavBar