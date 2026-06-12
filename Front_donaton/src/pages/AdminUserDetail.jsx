import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  Table,
  Alert
} from 'react-bootstrap';

import { useParams, useNavigate } from 'react-router-dom';

import usersApi from '../api/objects/user';
import logisticApi from '../api/objects/logistic'; 
import Button from '../components/atoms/Button';

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]); 
  const [globalStats, setGlobalStats] = useState({ totalMovimientos: 0 }); // Para darle contenido útil al perfil Admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDataAndLogistics = async () => {
      try {
        setLoading(true);
        
        // 1. Obtenemos los datos básicos del usuario consultado
        const userData = await usersApi.getById(id);
        setUser(userData);

        // 2. Traemos toda la logística general
        const logisticaCompleta = await logisticApi.getAll();
        
        // Guardamos el total de movimientos globales del sistema por si el usuario es Admin
        setGlobalStats({ totalMovimientos: logisticaCompleta.length });

        const targetUserId = Number(id);
        const isTargetAdmin = userData?.idUserType?.userType?.toLowerCase() === "admin";

        // 3. Si NO es admin, filtramos sus donaciones personales
        if (!isTargetAdmin) {
          const misDonaciones = logisticaCompleta.filter(item => {
            const idEnDonacion = Number(item.idDonation?.idUser?.idUser);
            const idEnRaiz = Number(item.idUser?.idUser); 
            return idEnDonacion === targetUserId || idEnRaiz === targetUserId;
          });
          setDonations(misDonaciones);
        }

        setError(null);
      } catch (error) {
        console.error("Error cargando datos en el panel de administración:", error);
        setError("No se pudo obtener el expediente del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndLogistics();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando expediente del usuario...</p>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Usuario no encontrado"}</Alert>
        <Button variant="outline-dark" onClick={() => navigate(-1)}>← Volver</Button>
      </Container>
    );
  }

  const isUserAdmin = user.idUserType?.userType?.toLowerCase() === "admin";

  // Cálculos estadísticos para usuarios comunes
  const totalDonaciones = donations.length;
  const totalMonto = donations.reduce((acc, item) => {
    if (item.idDonation?.idDonationType?.idDonationType === 1) {
      return acc + (item.idDonation?.amount || 0);
    }
    return acc;
  }, 0);

  return (
    <Container className="py-5">
      <Button
        variant="outline-dark"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        ← Volver al Listado
      </Button>
      
      <Card className="shadow-lg border-0">
        <Card.Body className="p-4">
          <Row>
            {/* Columna: Información de Cuenta (Aparece para ambos) */}
            <Col md={6} className="mb-4 mb-md-0">
              <h4 className="fw-bold text-success mb-4">Información de la Cuenta</h4>
              <div className="p-3 bg-light rounded border-start border-success border-4">
                <p className="mb-2"><strong>ID de Usuario:</strong> {user.idUser}</p>
                <p className="mb-2"><strong>Correo Electrónico:</strong> {user.email}</p>
                <p className="mb-0">
                  <strong>Rol del Sistema:</strong>{" "}
                  <Badge bg={isUserAdmin ? "danger" : "primary"}>
                    {user.idUserType?.userType?.toUpperCase()}
                  </Badge>
                </p>
              </div>
            </Col>

            {/* Columna Dinámica Derecha: Resumen de aportes (Donante) vs Resumen de Control (Admin) */}
            <Col md={6}>
              <h4 className="fw-bold text-success mb-4">
                {isUserAdmin ? "Métricas de Control" : "Balance de Aportes"}
              </h4>
              
              {isUserAdmin ? (
                /* VISTA EXCLUSIVA PARA CUENTAS ADMIN */
                <Card className="bg-dark text-white border-0 shadow-sm">
                  <Card.Body className="d-flex justify-content-around text-center py-4">
                    <div>
                      <h6 className="text-uppercase opacity-75 small">Nivel de Acceso</h6>
                      <h4 className="fw-bold mb-0 text-danger">Total (Root)</h4>
                    </div>
                    <div className="vr bg-white opacity-50"></div>
                    <div>
                      <h6 className="text-uppercase opacity-75 small">Registros Globales</h6>
                      <h4 className="fw-bold mb-0 text-warning">{globalStats.totalMovimientos} Items</h4>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                /* VISTA PARA USUARIOS DONANTES NORMALES */
                <Card className="bg-success text-white border-0 shadow-sm">
                  <Card.Body className="d-flex justify-content-around text-center py-4">
                    <div>
                      <h6 className="text-uppercase opacity-75 small">Total Aportes</h6>
                      <h2 className="fw-bold mb-0">{totalDonaciones}</h2>
                    </div>
                    <div className="vr bg-white opacity-50"></div>
                    <div>
                      <h6 className="text-uppercase opacity-75 small">Capital Monetario</h6>
                      <h2 className="fw-bold mb-0">${totalMonto.toLocaleString('es-CL')} CLP</h2>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Sección Inferior Dinámica */}
          {isUserAdmin ? (
            /* CONTENIDO INFORMATIVO CUANDO ES UN ADMINISTRADOR */
            <div className="p-4 bg-light rounded text-center border">
              <i className="bi bi-shield-lock-fill text-danger fs-1 mb-2"></i>
              <h5 className="fw-bold text-dark mt-2">Cuenta de Personal Administrativo</h5>
              <p className="text-muted small mx-auto" style={{ maxWidth: '600px' }}>
                Este usuario cuenta con permisos elevados de gestión logística y de causas. Por motivos de auditoría y diseño del modelo relacional, las cuentas de administrador no registran donaciones propias directas en el inventario público de ayuda humanitaria.
              </p>
            </div>
          ) : (
            /* TABLA DE HISTORIAL CUANDO ES UN DONANTE */
            <>
              <h4 className="fw-bold mb-4">Historial de Registro en Logística</h4>
              {donations.length === 0 ? (
                <Alert variant="info" className="text-center py-4">
                  Este usuario no registra transacciones monetarias ni despachos de objetos en el sistema.
                </Alert>
              ) : (
                <Table striped hover responsive className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID Donación</th>
                      <th>Fecha</th>
                      <th>Causa Destino</th>
                      <th>Tipo de Aporte</th>
                      <th>Cantidad / Monto</th>
                      <th>Estado del Envío</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((item, index) => {
                      const donation = item.idDonation;
                      const need = item.idNeeds;
                      const isMonetario = donation?.idDonationType?.idDonationType === 1;

                      return (
                        <tr key={donation?.idDonation || index}>
                          <td className="fw-bold">#{donation?.idDonation || "N/A"}</td>
                          <td>
                            {donation?.date ? new Date(donation.date).toLocaleDateString() : 'Sin fecha'}
                          </td>
                          <td>
                            <div className="fw-bold text-dark">{need?.needs || "Donación General"}</div>
                            <small className="text-muted text-uppercase fs-7">
                              ID Causa: {need?.idNeeds || "—"}
                            </small>
                          </td>
                          <td>
                            <Badge bg={isMonetario ? "success" : "info"}>
                              {donation?.idDonationType?.donationType || "No especificado"}
                            </Badge>
                          </td>
                          <td>
                            <span className={`fw-bold ${isMonetario ? 'text-success' : 'text-primary'}`}>
                              {isMonetario 
                                ? `$${(donation?.amount || 0).toLocaleString('es-CL')} CLP`
                                : `${donation?.amount || 0} Unidades`
                              }
                            </span>
                          </td>
                          <td>
                            <Badge bg={donation?.idDonationState?.idDonationState === 2 ? "success" : "warning"} text={donation?.idDonationState?.idDonationState === 2 ? "white" : "dark"}>
                              {donation?.idDonationState?.donationState || "En camino"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminUserDetail;