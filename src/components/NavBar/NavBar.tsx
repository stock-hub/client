import { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { AuthContext } from '../../context/auth.context'

export const NavBar: React.FC = () => {
  const { isLoggedIn, logOutUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const navigation = (): void => {
    navigate('/login')
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand>StockHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/dashboard">
                  Estadísticas
                </Nav.Link>
                <Nav.Link as={NavLink} to="/products?page=1">
                  Productos
                </Nav.Link>
                <Nav.Link as={NavLink} to="/invoices">
                  Facturas
                </Nav.Link>
              </>
            )}
          </Nav>
          <div>
            {isLoggedIn && (
              <Button
                variant="outline-danger"
                onClick={() => {
                  logOutUser()
                  navigation()
                }}
              >
                Sign out
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
