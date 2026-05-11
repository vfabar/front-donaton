import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import Image from '../components/atoms/Image';
import Button from '../components/atoms/Button';
import "../styles/Home.css";

function Home() {
  return (
    <Container className="home-container my-5">
      <Row className="align-items-center">
        <Col md={6}>
          {/* Usamos el átomo Text con diferentes variantes */}
          <Text variant="h1" className="display-4 fw-bold">
            Pequeñas acciones, grandes cambios
          </Text>
          <Text variant="p" className="lead mt-3">
            En <strong>Donation</strong>, conectamos corazones solidarios con causas que necesitan ayuda urgente: desde combatir la hambruna hasta proveer medicamentos en zonas críticas.
          </Text>
          <div className="mt-4">
            <Button variant="primary" size="lg" className="me-3"> {/*poner boton hacia registrarse o iniciar sesión*/}
              Donar ahora
            </Button>
            <Button variant="outline-secondary" size="lg"> {/*poner boton hacia proyectos*/}
              Saber más
            </Button>
          </div>
        </Col>
        
        <Col md={6} className="text-center">
          {/* Usamos tu átomo Image */}
          <Image 
            src="../../public/img/donatonLogo.webp"
            alt="donaton logo" 
            className="img-fluid rounded shadow-lg home-hero-img" 
          />
        </Col>
      </Row>

      <section className="mt-5 pt-5 text-center">
        <Text variant="h2">Nuestra Misión</Text>
        <div className="mission-box p-4 mt-3">
          <Text variant="p">
            Facilitar el acceso a recursos básicos para comunidades vulnerables mediante un sistema de donaciones transparente y directo.
          </Text>
        </div>
      </section>
    </Container> 
  );
}

export default Home;