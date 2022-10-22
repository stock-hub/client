import "./Footer.css"
import { Col, Container, Row } from "react-bootstrap"
import FooterContactForm from "../FooterContactForm/FooterContactForm"

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row md={8}>
          <Col className="footerMainInfo">
            <div className="footerInfo">
              <p className="footerCopy">CHATARRERIA Y FERRETERIA LA 2</p>
              <p><strong>Télefono:</strong> +57 310 431 4007</p>
              <p><strong>Dirección:</strong> Cra 2 # 11 - 28 Barrio: Bolivar</p>
              <p>Yumbo - Valle del Cauca.</p>
            </div>
            <img className="footerImg" src="https://res.cloudinary.com/andresgarcia/image/upload/v1666454559/la2da/Page%20Assets/Screenshot_2022-10-22_at_18.01.12_duyfgu.png" alt="Shop map location" />
            <hr className="mobileBreaker" />
          </Col>
          <Col md={4}>
            <FooterContactForm />
          </Col>
        </Row>
        <hr className="mobileBreaker" />
        <p className="footerCopyMobile">Chatarreria y Ferreteria La 2, S.A.S &copy;</p>
      </Container>
    </footer>
  )
}

export default Footer