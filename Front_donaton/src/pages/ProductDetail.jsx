import React, { useState } from 'react';
import { Container, Card, ProgressBar, Form, Alert, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/Products.js';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import "../styles/ProductDetail.css";


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const product = products.find((p) => p.id === parseInt(id));
  
  const user = JSON.parse(localStorage.getItem('user'));

  if (!product) return <Container><h1>No encontrado</h1></Container>;

  // Simulación de meta (puedes añadir meta y actual a Products.js luego)
  const meta = 1000;
  const actual = 650; 
  const porcentaje = (actual / meta) * 100;

const handleDonar = () => {
  if (!user) {
    alert("Debes iniciar sesión para donar");
    navigate('/login');
    return;
  }

  // Creamos el objeto de la nueva donación
  const nuevaDonacion = {
    id: Date.now(), // ID único basado en tiempo
    causa: product.name,
    cantidad: cantidad,
    fecha: new Date().toLocaleDateString()
  };

  // Actualizamos al usuario incluyendo el historial
  const updatedUser = { 
      ...user, 
      vidasAyudadas: (user.vidasAyudadas || 0) + parseInt(cantidad),
      historial: [nuevaDonacion, ...(user.historial || [])] // Agregamos al inicio de la lista
  };

  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  alert(`¡Gracias! Has donado ${cantidad} a: ${product.name}`);
  navigate('/profile');
};

  return (
    <Container className="product-detail-container py-5">
      <Button variant="outline-dark" className="mb-4" onClick={() => navigate(`/products`)}>
        ← Volver a Causas
      </Button>
      
      <Card className="border-0 shadow-lg overflow-hidden">
        <Row className="g-0">
          <Col md={6}>
            <Image src={product.image} alt={product.name} className="img-fluid h-100" style={{objectFit: 'cover'}} />
          </Col>
          <Col md={6}>
            <Card.Body className="p-4">
              <Text variant="h2" className="fw-bold text-success">{product.name}</Text>
              <Text variant="p" className="text-muted mb-4">{product.description}</Text>
              
              <div className="meta-section my-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Progreso de la meta</span>
                  <span className="fw-bold">{porcentaje}%</span>
                </div>
                <ProgressBar variant="success" now={porcentaje} label={`${porcentaje}%`} animated />
                <small className="text-muted">Meta: {meta} unidades / Recolectado: {actual}</small>
              </div>

              <div className="donation-box p-3 bg-light rounded">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Cantidad a donar (Dinero u objetos)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </Form.Group>
                
                <Button variant="danger" className="w-100 py-2 fw-bold" onClick={handleDonar}>
                  ¡Donar Ahora!
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProductDetail;