import React, { useState, useEffect } from 'react';
import { Container, Card, ProgressBar, Form, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import needsApi from '../api/objects/needs'; 
import donationApi from '../api/objects/donation'; // Usamos la API real
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario de donación
  const [cantidad, setCantidad] = useState(1);
  const [tipoDonacion, setTipoDonacion] = useState("Monetario");
  const [detalleObjeto, setDetalleObjeto] = useState("");

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
    fetchProduct();
  }, [id]);

  const handleDonar = async () => {
    if (!user) {
      alert("Inicia sesión para donar");
      navigate('/login');
      return;
    }

    // Estructura para enviar al POST de la API
    const dataDonacion = {
      date: new Date().toISOString(),
      amount: parseInt(cantidad),
      // Si es objeto, concatenamos el nombre del objeto en el detalle o tipo
      idDonationType: { 
        idDonationType: tipoDonacion === "Monetario" ? 1 : 2, 
        donationType: tipoDonacion === "Objeto" ? `Objeto: ${detalleObjeto}` : "Monetario"
      },
      idDonationState: { idDonationState: 1 }, // "En camino"
      idUser: { idUser: user.idUser }
    };

    try {
      await donationApi.create(dataDonacion);
      alert(`¡Gracias! Donación de ${tipoDonacion} registrada.`);
      navigate('/profile');
    } catch (error) {
      console.error("Error al donar:", error);
      alert("Error al procesar la donación.");
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" variant="success" /></Container>;
  if (!product) return <Container className="py-5"><h1>Causa no encontrada</h1></Container>;

  // Lógica de progreso y Bloqueo
  const meta = 1000 + (product.idNeeds * 100); 
  const actual = product.idNeedsState.idNeedsState === 2 ? meta : 450 + (product.idNeeds * 50); 
  const porcentaje = Math.round((actual / meta) * 100);
  const estaSuperada = product.idNeedsState.idNeedsState === 2;

  return (
    <Container className="py-5">
      <Button variant="outline-dark" className="mb-4" onClick={() => navigate(-1)}>← Volver</Button>
      <Card className="border-0 shadow-lg overflow-hidden">
        <Row className="g-0">
          <Col md={6}>
            <Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800" className="img-fluid h-100" style={{objectFit: 'cover'}} />
          </Col>
          <Col md={6}>
            <Card.Body className="p-4">
              <Badge bg="success" className="me-2">{product.idNeedsType.needsType}</Badge>
              <Badge bg={estaSuperada ? "info" : "warning"} text="dark">
                {product.idNeedsState.needsState}
              </Badge>

              <Text variant="h2" className="fw-bold mt-2 text-success">{product.needs}</Text>
              
              <div className="meta-section my-4">
                <ProgressBar variant={estaSuperada ? "info" : "success"} now={porcentaje} label={`${porcentaje}%`} animated={!estaSuperada} />
                <small className="text-muted">Meta: {meta} unidades / Recolectado: {actual}</small>
              </div>

              {/* LÓGICA DE BLOQUEO */}
              {!estaSuperada ? (
                <div className="donation-box p-3 border rounded bg-light">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">¿Qué deseas donar?</Form.Label>
                    <Form.Select value={tipoDonacion} onChange={(e) => setTipoDonacion(e.target.value)}>
                      <option value="Monetario">Dinero (CLP)</option>
                      <option value="Objeto">Objeto / Insumo</option>
                    </Form.Select>
                  </Form.Group>

                  {tipoDonacion === "Objeto" && (
                    <Form.Group className="mb-3">
                      <Form.Label>¿Qué objeto es? (Ej: Manta, Botiquín)</Form.Label>
                      <Form.Control type="text" placeholder="Nombre del objeto" value={detalleObjeto} onChange={(e) => setDetalleObjeto(e.target.value)} />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Cantidad</Form.Label>
                    <Form.Control type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                  </Form.Group>

                  <Button variant="danger" className="w-100 py-2 fw-bold" onClick={handleDonar}>Confirmar Donación</Button>
                </div>
              ) : (
                <Alert variant="info" className="text-center fw-bold py-4">
                  🔒 ESTA CAUSA HA SIDO SUPERADA <br/>
                  <small>No se aceptan más donaciones por el momento. ¡Gracias!</small>
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