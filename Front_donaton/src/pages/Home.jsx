import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Para que los botones funcionen
import Text from '../components/atoms/Text';
import Image from '../components/atoms/Image';
import Button from '../components/atoms/Button';
import "../styles/Home.css";
function Home() {
  const navigate = useNavigate();

  return (
    <Container fluid className="home-container px-0 position-relative">
      <Container>
        <Row className="align-items-center py-5">
          <Col md={6} className="text-start">
            <Text variant="h1" className="display-4 fw-bold">
              Pequeñas acciones, grandes cambios
            </Text>
            <Text variant="p" className="lead mt-3">
              En <strong>Donation</strong>, conectamos corazones solidarios con causas que necesitan ayuda urgente: desde combatir la hambruna hasta proveer medicamentos.
            </Text>
            <div className="mt-4 d-flex gap-3"> {/* d-flex y gap-3 para separar botones horizontalmente */}
              <Button 
                variant="success" 
                size="lg" 
                onClick={() => navigate('/products')} // cambiar a /registrarse o iniciar sesion cuando estén implementados
              >
                Donar ahora
              </Button>
              <Button 
                variant="outline-dark" 
                size="lg"
                onClick={() => navigate('/products')}
              >
                Saber más
              </Button>
            </div>
          </Col>
          
          <Col md={6} className="text-center mt-4 mt-md-0 hero-image-column">
            {/* IMPORTANTE: En React, las imágenes en 'public' se llaman con '/' directamente */}
            <div className="logo-container-white shadow-lg">
            <Image 
              src="/img/donatonLogo.webp"
              alt="donaton logo" 
              className="img-fluid rounded shadow-lg home-hero-img" 
            />
            </div>            
          </Col>
        </Row>
      </Container>

      <section className="mt-5 pt-5 text-center">
        <Container>
          <div className="mission-box p-4 shadow-sm bg-white">

          <Text variant="h2" className="mb-4">Nuestra Misión</Text>
            <Text variant="p" className="mb-0">
              Facilitar el acceso a recursos básicos para comunidades vulnerables mediante un sistema de donaciones transparente y directo.
             </Text>          
          </div>
        </Container>
      </section>
      </Container> 
  );
}

export default Home;