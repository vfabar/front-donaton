import React, { useState, useEffect } from 'react';
import { Container, Card, ProgressBar, Form, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import needsApi from '../api/objects/needs'; 
import donationApi from '../api/objects/donation'; // Usamos la API real
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';

// 1. Definimos la función de imágenes fuera del componente (o puedes importarla si la modularizas)
const getPlaceholderImage = (type) => {
  const images = {
    'Comida': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800',
    'Salud': 'https://www.tubotiquin.cl/cdn/shop/articles/que-debe-tener-un-botiquin-de-primeros-auxilios_592e319d-c15b-4ad0-b408-ff0e87020015.webp?v=1780536762',
    'Refugio': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800',
    'Ropa': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800',
    'Agua e Higiene': 'https://cospec.com.ar/wp-content/uploads/2022/03/Dia-mundial-del-agua_-22-de-marzo-de-2022.jpg'
  };
  
  return images[type] || 'https://img.magnific.com/foto-gratis/turistas-suben-colina-al-amanecer_1150-19692.jpg?semt=ais_hybrid&w=800&q=80';
};


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario de donación
  const [cantidad, setCantidad] = useState(1);
  const [tipoDonacion, setTipoDonacion] = useState("Monetario");
  const [detalleObjeto, setDetalleObjeto] = useState("");

  const [selectedSubtype, setSelectedSubtype] = useState({ id: 2, name: "Ropa y Abrigo" });

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

  // Manejador para actualizar el subtipo de objeto de acuerdo al Swagger
  const handleSubtypeChange = (e) => {
    const idType = parseInt(e.target.value);
    const names = {
      2: "Ropa y Abrigo",
      3: "Alimentos",
      4: "Insumos Médicos",
      5: "Agua e Higiene"
    };
    setSelectedSubtype({
      id: idType,
      name: names[idType]
    });
  };

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
    if (tipoDonacion === "Monetario") {
      navigate('/checkout-payment', { 
        state: { 
          donationData: dataDonacion,
          productName: product.needs, 
          idNeeds: product
        } 
      });
    } else {
    try {
      navigate('/checkout-object', {
        state: {
          donationData: dataDonacion,
          productName: product.needs,
          idNeeds: product
        }
      });
    } catch (error) {
      console.error("Error al donar:", error);
      alert("Error al procesar la donación.");
      }
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" variant="success" /></Container>;
  if (!product) return <Container className="py-5"><h1>Causa no encontrada</h1></Container>;


  const estaSuperada = product.id_needs_state === 2; 
  const stateText = product.NeedsState?.needsState || 'Sin estado';
  const typeText = product.NeedsType?.needsType || 'General';
  const cardImage = product.image || getPlaceholderImage(typeText);

  // Lógica de progreso y Bloqueo
  const meta = 1000 + (product.idNeeds * 100); 
  const actual = estaSuperada ? meta : 450 + (product.idNeeds * 50); 
  const porcentaje = Math.round((actual / meta) * 100);
return (
    <Container className="py-5">
      <Button variant="outline-dark" className="mb-4" onClick={() => navigate(-1)}>← Volver</Button>
      <Card className="border-0 shadow-lg overflow-hidden">
        <Row className="g-0">
          <Col md={6}>
            <Image src={cardImage} alt={product.needs} className="img-fluid h-100" style={{objectFit: 'cover'}} />
          </Col>
          <Col md={6}>
            <Card.Body className="p-4">
              <Badge bg="success" className="me-2">{typeText}</Badge>
              <Badge bg={estaSuperada ? "info" : "warning"} text="dark">
                {stateText}
              </Badge>

              <Text variant="h2" className="fw-bold mt-2 text-success">{product.needs}</Text>
              
              <div className="meta-section my-4">
                <ProgressBar variant={estaSuperada ? "info" : "success"} now={porcentaje} label={`${porcentaje}%`} animated={!estaSuperada} />
                <small className="text-muted">Meta: {meta} unidades / Recolectado: {actual}</small>
              </div>
              {/*    bloqueo.  */}
              {!estaSuperada ? (
                <div className="donation-box p-3 border rounded bg-light">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">¿Qué deseas donar?</Form.Label>
                    <Form.Select value={tipoDonacion} onChange={(e) => setTipoDonacion(e.target.value)}>
                      <option value="Monetario">Dinero (CLP)</option>
                      <option value="Objeto">Objeto / Insumo Físico</option>
                    </Form.Select>
                  </Form.Group>

                  {tipoDonacion === "Objeto" && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Selecciona la categoría del Objeto</Form.Label>
                      <Form.Select value={selectedSubtype.id} onChange={handleSubtypeChange}>
                        <option value="2">Ropa y Abrigo</option>
                        <option value="3">Alimentos</option>
                        <option value="4">Insumos Médicos</option>
                        <option value="5">Agua e Higiene</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Cantidad / Unidades</Form.Label>
                    <Form.Control type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                  </Form.Group>

                  <Button variant="danger" className="w-100 py-2 fw-bold" onClick={handleDonar}>Confirmar Donación</Button>
                </div>
              ) : (
                <Alert variant="info" className="text-center fw-bold py-4">
                  ESTA CAUSA HA SIDO SUPERADA <br/>
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