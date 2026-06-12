import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import donationApi from '../api/objects/donation'; 
import logisticApi from '../api/objects/logistic';
import Button from '../components/atoms/Button.jsx';
import Text from '../components/atoms/Text.jsx';
import '../styles/CheckoutPayment.css'; 

function CheckoutPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos la data completa enviada desde el detalle (donationData, productName e idNeeds)
  // NOTA: Para que funcione al 100%, asegúrate de que en ProductDetail.jsx pasaras el objeto "product" completo en lugar de solo el ID.
  const { donationData, productName, idNeeds } = location.state || {};

  // Estados del formulario de tarjeta
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: '',
    banco: 'Otros Bancos / Otro Método',
    tipo: 'Crédito'
  });  

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  // Si alguien entra directo a la URL sin pasar por un producto
  if (!donationData) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">No hay ninguna donación en proceso.</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Volver al Inicio</Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiracion') {
      let cleaned = value.replace(/\D/g, ''); 
      if (cleaned.length > 4) return;
      if (cleaned.length > 2) {
        cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      setTarjeta({ ...tarjeta, [name]: cleaned });
      return;
    }
    if (name === 'numero' && value.length > 16) return;
    if (name === 'cvv' && value.length > 4) return;

    setTarjeta({ ...tarjeta, [name]: value });
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación de campos de la tarjeta
    if (tarjeta.numero.length !== 16) {
      setError("El número de tarjeta debe tener exactamente 16 dígitos.");
      return;
    }
    const regexExpiracion = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regexExpiracion.test(tarjeta.expiracion)) {
      setError("La fecha de expiración no es válida. Use el formato MM/AA (Ej: 12/28).");
      return;
    }
    if (tarjeta.cvv.length < 3 || tarjeta.cvv.length > 4) {
      setError("El código CVV debe tener 3 o 4 dígitos.");
      return;
    }
    if (tarjeta.nombre.trim().length < 5) {
      setError("Por favor, ingrese el nombre completo del titular.");
      return;
    }

    setProcesando(true);

    try {
      // 1. Simulamos retraso de pasarela de pago
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // 2. Crear donación en Spring Boot
      const respuestaDonacion = await donationApi.create(donationData);
      
      // Manejamos si la respuesta viene directa o envuelta en .data de Axios
      const donacionCreada = respuestaDonacion?.data || respuestaDonacion;

      console.log("Donación creada exitosamente:", donacionCreada);

      // 3. ENLAZAR AUTOMÁTICAMENTE EN LOGÍSTICA (Siguiendo tu script de ejemplo exacto)
      if (donacionCreada && idNeeds) {
        
        // Replicamos la estructura exacta que Spring Boot aceptó en tu script
        const dataLogistica = {
          idDonation: {
            idDonation: donacionCreada.idDonation,
            date: donacionCreada.date,
            amount: donacionCreada.amount,
            idDonationType: { idDonationType: donacionCreada.idDonationType?.idDonationType || donationData.idDonationType?.idDonationType },
            idDonationState: { idDonationState: donacionCreada.idDonationState?.idDonationState || 1 },
            idUser: { idUser: donacionCreada.idUser?.idUser || donationData.idUser?.idUser }
          },
          idNeeds: {
            idNeeds: idNeeds.idNeeds || idNeeds, // Soporta si pasaste el número o el objeto product entero
            needs: idNeeds.needs || productName,
            idNeedsState: { idNeedsState: idNeeds.id_needs_state || idNeeds.idNeedsState?.idNeedsState || 1 },
            idNeedsType: { idNeedsType: idNeeds.id_needs_type || idNeeds.idNeedsType?.idNeedsType || 1 },
            idUbication: { idUbication: idNeeds.id_ubication || idNeeds.idUbication?.idUbication || 1 }
          }
        };

        console.log("Enviando JSON estructurado a Logística:", dataLogistica);
        
        // Enviamos a la API de logística
        await logisticApi.create(dataLogistica);
        
      } else {
        console.warn("No se pudo enlazar en logística. Faltan datos críticos.", { donacionCreada, idNeeds });
      }

      alert(`¡Pago Exitoso! Tu donación de $${donationData.amount.toLocaleString('es-CL')} CLP ha sido registrada.`);
      navigate('/profile'); 

    } catch (err) {
      console.error("Error al procesar el pago o guardar en la API:", err);
      setError("Hubo un problema al procesar la transacción. Inténtalo de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4 border-0" style={{ maxWidth: '550px', width: '100%' }}>
        <Card.Body>
          <Text variant="h3" className="fw-bold text-success mb-2 text-center">Pago Seguro</Text>
          <p className="text-muted text-center small mb-4">Conexión cifrada de extremo a extremo</p>
          
          {/* Resumen del Pago */}
          <div className="bg-light p-3 rounded mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small">Causa:</span>
              <span className="fw-bold text-truncate ms-2" style={{maxWidth: '250px'}}>{productName}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark">Monto a transferir:</span>
              <span className="fs-4 fw-bold text-success">${donationData.amount.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handlePagar}>
            {/* Banco y Tipo de Tarjeta */}
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Institución Bancaria</Form.Label>
                  <Form.Select name="banco" value={tarjeta.banco} onChange={handleChange} disabled={procesando}>
                    <option value="BancoEstado">BancoEstado</option>
                    <option value="Banco de Chile">Banco de Chile</option>
                    <option value="Santander">Santander</option>
                    <option value="Otros Bancos / Otro Método">Otros Bancos / Cualquier método</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Tipo de Tarjeta</Form.Label>
                  <Form.Select name="tipo" value={tarjeta.tipo} onChange={handleChange} disabled={procesando}>
                    <option value="Crédito">Tarjeta de Crédito</option>
                    <option value="Débito">Tarjeta de Débito</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Número de Tarjeta */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small mb-0">Número de Tarjeta</Form.Label>
              <Form.Control 
                type="number" 
                name="numero"
                placeholder="1234 5678 9012 3456" 
                value={tarjeta.numero}
                onChange={handleChange}
                required
                disabled={procesando}
              />
              <Form.Text className="text-muted overhead small">
                crédito, débito o prepago. Sin espacios ni guiones.
              </Form.Text>
            </Form.Group>

            {/* Nombre del Titular */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Nombre en la Tarjeta</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre"
                placeholder="JUAN PEREZ COTAPOS" 
                className="text-uppercase"
                value={tarjeta.nombre}
                onChange={handleChange}
                required
                disabled={procesando}
              />
            </Form.Group>

            {/* Fecha y CVV */}
            <Row className="mb-4">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Vencimiento</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="expiracion"
                    placeholder="MM/AA" 
                    value={tarjeta.expiracion}
                    onChange={handleChange}
                    required
                    disabled={procesando}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small">CVV</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="cvv"
                    placeholder="123" 
                    value={tarjeta.cvv}
                    onChange={handleChange}
                    required
                    disabled={procesando}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Botón de envío */}
            <Button 
              variant="success" 
              className="w-100 py-2.5 fw-bold d-flex justify-content-center align-items-center" 
              type="submit"
              disabled={procesando}
            >
              {procesando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verificando fondos con {tarjeta.banco}...
                </>
              ) : (
                `Confirmar Pago Seguro`
              )}
            </Button>
            
            <Button 
              variant="link" 
              className="w-100 mt-2 text-muted text-decoration-none small" 
              onClick={() => navigate(-1)}
              disabled={procesando}
            >
              Cancelar y regresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CheckoutPayment;