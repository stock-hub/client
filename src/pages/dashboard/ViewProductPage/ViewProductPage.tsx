import { useContext, useEffect, useState } from 'react'
import { Form, Button, Container, Modal, Dropdown } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Product, Maintenance } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { ViewProductImgs } from '../../../components/dashboard/ViewProductImgs/ViewProductImgs'
import { formatAmount, formatDate, generateOrderId } from '../../../utils/tools'
import { AuthContext } from '../../../context/auth.context'
import { Employee } from '../../../types/user.type'

interface RouteParams {
  [key: string]: string | undefined
  productId: string
}

export const ViewProductPage: React.FC = () => {
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    price: '' as unknown as number,
    imageUrl: [],
    tags: [],
    onSell: false,
    inStock: false,
    quantity: 1,
    maintenance: []
  })
  const [maintenance, setMaintenance] = useState<Maintenance>({
    id: '',
    date: new Date(),
    description: '',
    personInCharge: ''
  })
  const { productId } = useParams<RouteParams>()
  const [show, setShow] = useState(false)
  const onSell = product.onSell ? 'Producto en venta' : ''
  const [refresh, setRefresh] = useState(false)
  const [nameSelected, setNameSelected] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    productService
      .getProduct(productId as string)
      .then(({ data }: { data: Product }) => setProduct(data))
      .catch((error: Error) => console.error(error))
  }, [productId, refresh])

  const deleteProduct = (productId: string) => {
    productService
      .deleteProduct(productId)
      .then(() => navigate(-1))
      .catch((error: Error) => console.error(error))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log(maintenance)

    await productService.editProduct(productId!, {
      ...product,
      maintenance: [...(product.maintenance || []), maintenance]
    })

    setShow(false)
    setRefresh(!refresh)
    setMaintenance({
      id: '',
      date: new Date(),
      description: '',
      personInCharge: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'personInCharge') {
      setNameSelected(false)
    }

    setMaintenance({ ...maintenance, [e.target.name]: e.target.value })
  }

  const handleEmployeeSelect = (employee: Employee) => {
    setMaintenance({ ...maintenance, personInCharge: employee.name, id: generateOrderId() })
    setNameSelected(true)
  }

  console.log(product.maintenance)

  return (
    <>
      <Container>
        <br />
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <br />
        <br />
        <ViewProductImgs imgs={product.imageUrl} />
        <h1>{product.name}</h1>
        <p>${formatAmount(product.price)}</p>
        <p>{onSell}</p>
        <p>{product.onSell ? `Cantidad: ${product.quantity}` : ''}</p>
        <p>{product.description}</p>
        <Link className="btn btn-outline-info" style={{ marginRight: '10px' }} to={`/products/${product._id}/edit`}>
          Editar
        </Link>
        <Button variant="outline-danger" onClick={() => deleteProduct(product._id!)}>
          Borrar
        </Button>

        <br />
        <br />

        <Button variant="primary" onClick={() => setShow(true)}>
          Añadir nueva observación
        </Button>

        <br />
        <br />

        {product.maintenance && product.maintenance.length > 0 && (
          <div>
            <h2>Observaciones</h2>
            <ul>
              {product.maintenance
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((maintenance) => (
                  <li key={maintenance.id}>
                    <p>
                      <b>Fecha:</b> {formatDate(maintenance.date.toString(), true)}
                    </p>
                    <p>
                      <b>Descripción:</b> {maintenance.description}
                    </p>
                    <p>
                      <b>Persona responsable:</b> {maintenance.personInCharge}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Añadir nueva observación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha"
                  value={formatDate(maintenance.date.toString(), true)}
                  name="date"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descripción"
                  name="description"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Persona responsable</Form.Label>
                <Form.Control
                  type="text"
                  name="personInCharge"
                  value={maintenance.personInCharge}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {user && user.employees && user.employees.length > 0 && maintenance.personInCharge && !nameSelected && (
                <Dropdown.Menu
                  show
                  style={{
                    width: '44%',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {user.employees
                    .filter((employee) =>
                      employee.name.toLowerCase().includes(maintenance.personInCharge.toLowerCase())
                    )
                    .map((employee, idx) => (
                      <Dropdown.Item key={idx} onClick={() => handleEmployeeSelect(employee)}>
                        {employee.name}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              )}
              <Button type="button" variant="secondary" onClick={() => setShow(false)}>
                Cerrar
              </Button>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
      <br />
      <br />
    </>
  )
}
