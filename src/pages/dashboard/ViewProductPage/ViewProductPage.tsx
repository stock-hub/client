import { useContext, useEffect, useState } from 'react'
import { Form, Button, Container, Modal, Dropdown, Table } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Product } from '../../../types/product.type'
import productService from '../../../services/products.service'
import { ViewProductImgs } from '../../../components/dashboard/ViewProductImgs/ViewProductImgs'
import { formatAmount, formatDate } from '../../../utils/tools'
import { AuthContext } from '../../../context/auth.context'
import { Employee } from '../../../types/user.type'
import maintenanceService from '../../../services/maintenance.service'
import { Maintenance } from '../../../types/maintenance.type'

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
    date: new Date(),
    description: '',
    personInCharge: ''
  })
  const [maintenanceToEdit, setMaintenanceToEdit] = useState<Maintenance>({
    date: new Date(),
    description: '',
    personInCharge: ''
  })
  const { productId } = useParams<RouteParams>()
  const [showNewMaintenanceForm, setShowNewMaintenanceForm] = useState(false)
  const [showEditMaintenanceForm, setShowEditMaintenanceForm] = useState(false)
  const [showMaintenance, setShowMaintenance] = useState(false)
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

    const newMaintenance = await maintenanceService.newMaintenance(maintenance)
    const maintenancesIds: string[] = (product.maintenance as Maintenance[]).map((maintenance) => maintenance._id!)

    await productService.editProduct(productId!, {
      ...product,
      maintenance: [...(maintenancesIds || []), newMaintenance.data._id!]
    })

    setShowNewMaintenanceForm(false)
    setRefresh(!refresh)
    setMaintenance({
      date: new Date(),
      description: '',
      personInCharge: ''
    })
  }

  const handleEditMaintenanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await maintenanceService.editMaintenance(maintenanceToEdit._id!, maintenanceToEdit)

    setShowEditMaintenanceForm(false)
    setRefresh(!refresh)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'personInCharge') {
      setNameSelected(false)
    }

    setMaintenance({ ...maintenance, [e.target.name]: e.target.value })
  }

  const handleEditMaintenanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'personInCharge') {
      setNameSelected(false)
    }

    setMaintenanceToEdit({ ...maintenanceToEdit, [e.target.name]: e.target.value })
  }

  const handleEmployeeSelect = (employee: Employee, editMaintenance: boolean = false) => {
    if (editMaintenance) {
      setMaintenanceToEdit({ ...maintenanceToEdit, personInCharge: employee.name })
    } else {
      setMaintenance({ ...maintenance, personInCharge: employee.name })
    }
    setNameSelected(true)
  }

  const deleteMaintenance = async (maintenanceId: string) => {
    try {
      await maintenanceService.deleteMaintenance(maintenanceId)

      setRefresh(!refresh)

      await productService.editProduct(productId!, {
        ...product,
        maintenance: (product.maintenance as Maintenance[]).filter((maintenance) => maintenance._id !== maintenanceId)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const sliceDescription = (description: string) => {
    if (description.length > 100) {
      return description.slice(0, 100) + '...'
    }

    return description
  }

  const sliceName = (name: string) => {
    if (name.length > 10) {
      return name.slice(0, 20) + '...'
    }

    return name
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setMaintenanceToEdit(maintenance)
    setNameSelected(true)
    setShowEditMaintenanceForm(true)
  }

  const showModalMaintenance = (maintenance: Maintenance) => {
    setMaintenance(maintenance)
    setNameSelected(true)
    setShowMaintenance(true)
  }

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

        <Button
          variant="primary"
          onClick={() => {
            setShowNewMaintenanceForm(true)
            setMaintenance({
              date: new Date(),
              description: '',
              personInCharge: ''
            })
          }}
        >
          Añadir nueva observación
        </Button>

        <br />
        <br />

        {product.maintenance && product.maintenance.length > 0 && (
          <div>
            <h2>Observaciones</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Persona responsable</th>
                </tr>
              </thead>
              <tbody>
                {(product.maintenance as Maintenance[])
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((maintenance, idx) => (
                    <tr key={idx}>
                      <td style={{ cursor: 'pointer' }} onClick={() => showModalMaintenance(maintenance)}>
                        {idx + 1}
                      </td>
                      <td style={{ cursor: 'pointer' }} onClick={() => showModalMaintenance(maintenance)}>
                        {formatDate(maintenance.date.toString(), true)}
                      </td>
                      <td style={{ cursor: 'pointer' }} onClick={() => showModalMaintenance(maintenance)}>
                        {sliceDescription(maintenance.description)}
                      </td>
                      <td style={{ cursor: 'pointer' }} onClick={() => showModalMaintenance(maintenance)}>
                        {sliceName(maintenance.personInCharge)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteMaintenance(maintenance._id!)}
                          className="btn btn-danger"
                        >
                          Borrar
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleEditMaintenance(maintenance)}
                          className="btn btn-warning"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        )}

        <Modal
          show={showNewMaintenanceForm}
          onHide={() => setShowNewMaintenanceForm(false)}
          backdrop="static"
          keyboard={false}
        >
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
                  value={maintenance.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Persona responsable</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  name="personInCharge"
                  value={maintenance.personInCharge}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {user && user.employees && user.employees.length > 0 && maintenance.personInCharge && !nameSelected && (
                <Dropdown.Menu
                  show
                  style={{
                    width: '55%',
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
              <Button type="button" variant="secondary" onClick={() => setShowNewMaintenanceForm(false)}>
                Cerrar
              </Button>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showEditMaintenanceForm}
          onHide={() => setShowEditMaintenanceForm(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Editar observación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditMaintenanceSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha"
                  value={formatDate(maintenanceToEdit.date.toString(), true)}
                  name="date"
                  onChange={handleEditMaintenanceInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descripción"
                  name="description"
                  value={maintenanceToEdit.description}
                  onChange={handleEditMaintenanceInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Persona responsable</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  name="personInCharge"
                  value={maintenanceToEdit.personInCharge}
                  onChange={handleEditMaintenanceInputChange}
                />
              </Form.Group>
              {user &&
                user.employees &&
                user.employees.length > 0 &&
                maintenanceToEdit.personInCharge &&
                !nameSelected && (
                  <Dropdown.Menu
                    show
                    style={{
                      width: '55%',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {user.employees
                      .filter((employee) =>
                        employee.name.toLowerCase().includes(maintenanceToEdit.personInCharge.toLowerCase())
                      )
                      .map((employee, idx) => (
                        <Dropdown.Item key={idx} onClick={() => handleEmployeeSelect(employee, true)}>
                          {employee.name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                )}
              <Button type="button" variant="secondary" onClick={() => setShowEditMaintenanceForm(false)}>
                Cerrar
              </Button>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal size="lg" show={showMaintenance} onHide={() => setShowMaintenance(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Observación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>Fecha:</b> {formatDate(maintenance.date.toString(), true)}
            </p>
            <p>
              <b>Persona responsable:</b> {maintenance.personInCharge}
            </p>
            <p>
              <b>Descripción:</b> {maintenance.description}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMaintenance(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <br />
      <br />
    </>
  )
}
