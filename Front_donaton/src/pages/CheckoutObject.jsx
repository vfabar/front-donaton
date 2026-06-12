import React, { useState } from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import donationApi from '../api/objects/donation'; 
import logisticApi from '../api/objects/logistic';
import Button from '../components/atoms/Button.jsx';
import Text from '../components/atoms/Text.jsx';

function CheckoutObject() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos la información enviada del detalle
  const { donationData, productName, idNeeds } = location.state || {};

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  const [puntoEntrega, setPuntoEntrega] = useState("Centro de acopio principal");

  if (!donationData || !idNeeds) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">No hay ningún proceso de donación físico activo.</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Volver al Inicio</Button>
      </Container>
    );
  }

  const handleRegistrarObjeto = async (e) => {
    e.preventDefault();
    setError(null);
    setProcesando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const respuestaDonacion = await donationApi.create(donationData);
      const donacionCreada = respuestaDonacion?.data || respuestaDonacion;

      console.log("Donación física creada con éxito:", donacionCreada);

      if (donacionCreada && idNeeds) {
        const dataLogistica = {
          idDonation: {
            idDonation: donacionCreada.idDonation,
            date: donacionCreada.date,
            amount: donacionCreada.amount,
            idDonationType: { idDonationType: donacionCreada.idDonationType?.idDonationType },
            idDonationState: { idDonationState: donacionCreada.idDonationState?.idDonationState || 1 },
            idUser: { idUser: donacionCreada.idUser?.idUser }
          },
          idNeeds: {
            idNeeds: idNeeds.idNeeds,
            needs: idNeeds.needs || productName,
            idNeedsState: { idNeedsState: idNeeds.idNeedsState?.idNeedsState || idNeeds.id_needs_state || 1 },
            idNeedsType: { idNeedsType: idNeeds.idNeedsType?.idNeedsType || 1 },
            idUbication: { idUbication: idNeeds.idUbication?.idUbication || 1 }
          }
        };

        console.log("Enviando JSON estructurado de objeto a Logística:", dataLogistica);
        
        await logisticApi.create(dataLogistica);
      } else {
        console.warn("Faltan identificadores para asociar la logística del insumo.");
      }

      alert(`¡Registro Exitoso! Tu compromiso de donar ${donationData.amount} unidad(es) de "${donationData.idDonationType.donationType}" ha sido guardado.`);
      navigate('/profile');

    } catch (err) {
      console.error("Error procesando inserción de logística de objetos:", err);
      setError("No se pudo asociar la entrega física con la causa de destino. Inténtalo de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4 border-0" style={{ maxWidth: '550px', width: '100%' }}>
        <Card.Body>
          <Text variant="h3" className="fw-bold text-success mb-2 text-center">Compromiso de Entrega</Text>
          <p className="text-muted text-center small mb-4">Registro de insumos y recursos físicos para ayuda humanitaria</p>
          
          {/* Resumen de la Causa y el Insumo */}
          <div className="bg-light p-3 rounded mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Causa Destino:</span>
              <span className="fw-bold text-truncate ms-2" style={{maxWidth: '250px'}}>{productName}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Tipo de Recurso:</span>
              <span className="badge bg-primary fs-6">{donationData.idDonationType.donationType}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark">Cantidad Comprometida:</span>
              <span className="fs-4 fw-bold text-success">{donationData.amount} Unidades</span>
            </div>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleRegistrarObjeto}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small">Punto de Entrega / Despacho</Form.Label>
              <Form.Select 
                value={puntoEntrega} 
                onChange={(e) => setPuntoEntrega(e.target.value)}
                disabled={procesando}
              >
                <option value="Centro de acopio principal">Centro de Acopio de la Comuna (Presencial)</option>
                <option value="Envio por encomienda">Envío Remoto ( Starken / Chilexpress )</option>
                <option value="Retiro a domicilio">Solicitar Retiro Municipal a Domicilio</option>
              </Form.Select>
              <Form.Text className="text-muted small">
                Selecciona cómo harás llegar los insumos a la dirección de la causa: <strong>{idNeeds.idUbication?.street || "Dirección registrada"}</strong>.
              </Form.Text>
            </Form.Group>

            <Button 
              variant="success" 
              className="w-100 py-2.5 fw-bold d-flex justify-content-center align-items-center" 
              type="submit"
              disabled={procesando}
            >
              {procesando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registrando en el inventario de logística...
                </>
              ) : (
                `Confirmar Registro de Insumo`
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

export default CheckoutObject;