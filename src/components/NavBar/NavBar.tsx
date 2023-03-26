import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap'
import { AuthContext } from '../../context/auth.context'

export const NavBar: React.FC = () => {
  const { isLoggedIn, logOutUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const navigation = (): void => {
    navigate('/dashboard/login')
  }

  return (
    <Navbar bg='light' expand='lg'>
      <Container fluid>
        <Navbar.Brand>StockHub</Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto my-2 my-lg-0' style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href='/'>Home</Nav.Link>
            {isLoggedIn && (
              <>
                <NavDropdown title='Dashboard' id='basic-nav-dropdown'>
                  <NavDropdown.Item href='/dashboard'>Statistics</NavDropdown.Item>
                  <NavDropdown.Item href='/dashboard/products?page=1'>Products</NavDropdown.Item>
                  <NavDropdown.Item href='/dashboard/invoices'>Invoices</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
          <div>
            {isLoggedIn && (
              <Button
                variant='outline-danger'
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
