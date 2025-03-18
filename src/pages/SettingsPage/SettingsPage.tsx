import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { SettingsOptions } from './SettingsPage.styled'
import { Button, Form, ListGroup, Row, Col, Stack, Badge } from 'react-bootstrap'
import { AuthContext } from '../../context/auth.context'
import { User } from '../../types/user.type'
import authService from '../../services/auth.service'
import cloudImagesService from '../../services/cloud_images.service'
import { Img } from '../../utils/mixins'

export const SettingsPage: React.FC = () => {
  const [showTags, setShowTags] = useState<boolean>(false)
  const [showProfileImg, setProfileImg] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const [userCopy, setUserCopy] = useState<User | null>(user)
  const [newTag, setNewTag] = useState<string>('')
  const [uploadData, setUploadData] = useState<FormData | null>()

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
        </SettingsOptions>
      </>
    )
  )
}
