import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { SettingsOptions } from './SettingsPage.styled'
import { Button, Form, ListGroup, Row, Col, Stack, Badge, Table } from 'react-bootstrap'
import { AuthContext } from '../../context/auth.context'
import { User } from '../../types/user.type'
import authService from '../../services/auth.service'
import cloudImagesService from '../../services/cloud_images.service'
import { Img } from '../../utils/mixins'
import { Employee, ROLES } from '../../types/employee.type'
import employeeService from '../../services/employee.service'

export const SettingsPage: React.FC = () => {
  const [showTags, setShowTags] = useState<boolean>(false)
  const [showProfileImg, setProfileImg] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const [userCopy, setUserCopy] = useState<User | null>(user)
  const [newTag, setNewTag] = useState<string>('')
  const [uploadData, setUploadData] = useState<FormData | null>()
  const [showEmployees, setShowEmployees] = useState<boolean>(false)
  const [employee, setEmployee] = useState<Employee>({
    name: '',
    email: '',
    phone: 0,
    role: ROLES.EMPLOYEE,
    user: user!
  })

  const updateUser = async (updates: Partial<User>) => {
    await authService.updateUser(updates)
  }

  const removeTag = async (tag: string, tags: string[]) => {
    const filteredTags = tags.filter((t) => t !== tag)

    setUserCopy((prev) => prev && { ...prev, tags: filteredTags })

    await updateUser({ tags: filteredTags })
  }

  const addTag = async (tags: string[], e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updatedTags = [...tags, newTag]

    setUserCopy((prev) => prev && { ...prev, tags: updatedTags })

    await updateUser({ tags: updatedTags })

    setNewTag('')
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value)
  }

  const uploadLogoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadData = new FormData()

    uploadData.append('imageUrl', e.target.files![0])

    setUploadData(uploadData)
  }

  const handleImgFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!uploadData) return

    const { data }: { data: { cloudinary_url: string } } = await cloudImagesService.uploadImage(uploadData)

    await cloudImagesService.deleteImage(userCopy!.logoUrl)

    setUserCopy((prev) => prev && { ...prev, logoUrl: data.cloudinary_url })

    await updateUser({ logoUrl: data.cloudinary_url })
  }

  const addEmployee = async (employees: Employee[], e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updatedEmployees = [...(employees || []), employee]

    const newEmployee = await employeeService.newEmployee(employee)

    setUserCopy((prev) => prev && { ...prev, employees: updatedEmployees })

    const employeesIds: string[] = updatedEmployees.map((employee) => employee._id!)

    await updateUser({ employees: [...(employeesIds || []), newEmployee.data._id!] })

    setEmployee({
      name: '',
      email: '',
      phone: 0,
      role: ROLES.EMPLOYEE,
      user: user!
    })
  }

  const handleEmployeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value })
  }

  const removeEmployee = async (employee: Employee, employees: Employee[]) => {
    const filteredEmployees = employees.filter((e) => e.name !== employee.name)

    setUserCopy((prev) => prev && { ...prev, employees: filteredEmployees })

    await updateUser({ employees: filteredEmployees })

    await employeeService.deleteEmployee(employee._id!)
  }

  return (
    userCopy && (
      <>
        <SettingsOptions>
          <h1>Configuración</h1>
          <br />
          <h1>Cuenta</h1>
          <ListGroup.Item>
            <Link to="/change_password">Cambiar contraseña</Link>
          </ListGroup.Item>

          <ListGroup.Item>
            <Button variant="outline-secondary" type="button" onClick={() => setProfileImg((prev) => !prev)}>
              Cambiar logo
            </Button>

            {showProfileImg && (
              <>
                <br />
                <Img src={userCopy.logoUrl} alt="Logo image" />

                <Form onSubmit={handleImgFormSubmit}>
                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Nuevo logo</Form.Label>
                    <Form.Control type="file" name="imageUrl" onChange={uploadLogoUrl} />
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={!uploadData}>
                    Subir
                  </Button>
                </Form>
              </>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <Button variant="outline-secondary" type="button" onClick={() => setShowTags((prev) => !prev)}>
              Añadir/Eliminar tags
            </Button>

            {showTags && (
              <>
                <br />
                <br />
                <div>
                  <Form onSubmit={(e) => addTag(userCopy.tags, e)}>
                    <Row>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          name="newTag"
                          placeholder="Añadir tag"
                          value={newTag}
                          onChange={handleTagInputChange}
                          required
                          autoComplete="off"
                        />
                      </Col>
                      <Col md={6}>
                        <Button variant="primary" type="submit">
                          Añadir
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <br />
                  <br />
                  <p>Haz click en un tag para eliminarlo.</p>

                  <Stack direction="horizontal" gap={2}>
                    {userCopy.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        style={{ cursor: 'pointer' }}
                        bg="dark"
                        onClick={() => removeTag(tag, userCopy.tags)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Stack>
                </div>
              </>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <Button variant="outline-secondary" type="button" onClick={() => setShowEmployees((prev) => !prev)}>
              Añadir/Eliminar empleados
            </Button>

            {showEmployees && (
              <>
                <br />
                <br />
                <h4>Rellena los campos para añadir un empleado</h4>
                <br />
                <div>
                  <Form onSubmit={(e) => addEmployee(userCopy.employees as Employee[], e)}>
                    <Row>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          name="name"
                          autoComplete="off"
                          required
                          placeholder="Nombre del empleado"
                          value={employee.name}
                          onChange={handleEmployeeInputChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="email"
                          name="email"
                          autoComplete="off"
                          required
                          placeholder="Email"
                          value={employee.email}
                          onChange={handleEmployeeInputChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="number"
                          name="phone"
                          required
                          placeholder="Teléfono"
                          autoComplete="off"
                          value={employee.phone === 0 ? '' : employee.phone}
                          onChange={handleEmployeeInputChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Select
                          name="role"
                          required
                          onChange={(e) => setEmployee({ ...employee, role: e.target.value as ROLES })}
                        >
                          <option disabled selected={true}>
                            Selecciona un rol
                          </option>
                          <option value={ROLES.EMPLOYEE}>Empleado</option>
                          <option value={ROLES.ADMIN}>Administrador</option>
                        </Form.Select>
                      </Col>
                      <Col md={2}>
                        <Button variant="primary" type="submit">
                          Añadir
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <br />
                  <br />
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(userCopy.employees as Employee[])?.map((employee, idx) => (
                        <tr key={idx}>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.role}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => removeEmployee(employee, userCopy.employees as Employee[])}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </ListGroup.Item>
        </SettingsOptions>
      </>
    )
  )
}
