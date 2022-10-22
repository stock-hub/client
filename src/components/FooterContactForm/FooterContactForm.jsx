import { Button, Form, InputGroup } from "react-bootstrap"
import "./FooterContactForm.css"

const FooterContactForm = () => {
  return (
    <>
      <h5>¿No encuentra lo que busca?</h5>
      <p>Déjenos sus datos y nosotros le llamamos</p>


      <Form>
        <Form.Control className="mb-3" type="text" placeholder="Nombre" />
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">+57</InputGroup.Text>
            <input type="number" className="form-control footerFormTel" placeholder="Número de teléfono" aria-label="Número de teléfono" min="0" aria-describedby="basic-addon1" />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control placeholder="Escriba aquí su consulta" as="textarea" rows={3} />
        </Form.Group>
        <Button variant="outline-secondary" type="submit">
          Enviar
        </Button>
      </Form>
    </>
  )
}

export default FooterContactForm