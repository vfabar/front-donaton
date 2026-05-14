import React, { useState, useEffect } from 'react';
import { Container, Card, ProgressBar, Form, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';import { useParams, useNavigate } from 'react-router-dom';
import needsApi from '../api/objects/needs'; // Importamos la API de necesidades
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await needsApi.getById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct(id);
  }, [id]);

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="success" />
    </Container>
  );

  if (!product) return <Container className="py-5"><h1>Causa no encontrada</h1></Container>;

  // --- LÓGICA DE PROGRESO (Simulada con datos del ID ya que la API no trae metas) ---
  const meta = 1000 + (product.idNeeds * 100); // Meta dinámica basada en ID
  const actual = product.idNeedsState.idNeedsState === 2 ? meta : 450 + (product.idNeeds * 50); 
  const porcentaje = Math.round((actual / meta) * 100);

  // Imagen según tipo (misma lógica que en la Card)
  const images = {
    'Salud': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
    'Refugio': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800',
    'Comida': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800',
    'Ropa': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800'
  };
  const productImg = images[product.idNeedsType.needsType] || 'https://images.unsplash.com/photo-1469571480357-0a8a01699b04?q=80&w=800';

  const handleDonar = () => {
    if (!user) {
      alert("Debes iniciar sesión para donar");
      navigate('/login');
      return;
    }

    const nuevaDonacion = {
      id: Date.now(),
      causa: product.needs,
      cantidad: cantidad,
      fecha: new Date().toLocaleDateString()
    };

    const updatedUser = { 
        ...user, 
        vidasAyudadas: (user.vidasAyudadas || 0) + parseInt(cantidad),
        historial: [nuevaDonacion, ...(user.historial || [])]
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert(`¡Gracias! Has donado ${cantidad} a: ${product.needs}`);
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
            <Image src={productImg} alt={product.needs} className="img-fluid h-100" style={{objectFit: 'cover'}} />
          </Col>
          <Col md={6}>
            <Card.Body className="p-4">
              <div className="mb-2">
                <Badge bg="success" className="me-2">{product.idNeedsType.needsType}</Badge>
                <Badge bg={product.idNeedsState.idNeedsState === 2 ? "info" : "warning"} text="dark">
                  {product.idNeedsState.needsState}
                </Badge>
              </div>

              <Text variant="h2" className="fw-bold text-success">{product.needs}</Text>
              
              <div className="location-info mb-4 p-2 bg-light rounded">
                <small className="text-muted d-block">Ubicación de la necesidad:</small>
                <strong>{product.idUbication.street}</strong><br/>
                <span>{product.idUbication.idDistric.distric}, {product.idUbication.idDistric.idRegion.region}</span>
              </div>
              
              <div className="meta-section my-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Progreso de la meta</span>
                  <span className="fw-bold">{porcentaje}%</span>
                </div>
                <ProgressBar 
                  variant={porcentaje === 100 ? "info" : "success"} 
                  now={porcentaje} 
                  label={`${porcentaje}%`} 
                  animated={porcentaje < 100} 
                />
                <small className="text-muted">Meta: {meta} unidades / Recolectado: {actual}</small>
              </div>

              {product.idNeedsState.idNeedsState !== 2 ? (
                <div className="donation-box p-3 border rounded">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Cantidad a donar (Suministros o Unidades)</Form.Label>
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
              ) : (
                <Alert variant="info" className="text-center fw-bold">
                  ¡Esta meta ha sido superada! Gracias a todos.
                </Alert>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProductDetail;