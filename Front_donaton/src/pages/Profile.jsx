import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Row, Col, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logisticApi from '../api/objects/logistic'; 

function Profile() {
    const navigate = useNavigate();
    const [actividad, setActividad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 1. Obtenemos el usuario y forzamos que el ID sea un número para comparar bien
    const user = useMemo(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    }, []);
    
    const isAdmin = user?.idUserType?.userType?.toLowerCase() === 'admin';
    const userId = user?.idUser ? Number(user.idUser) : null;

    useEffect(() => {
        const fetchLogisticaCompleta = async () => {
            if (!user) {
                navigate('/login');
                return;
            }
            
            try {
                setLoading(true);
                // Llamamos a la API de Logística
                const data = await logisticApi.getAll();
                console.log("Datos recibidos de la API:", data); // Para depuración

                if (isAdmin) {
                    setActividad(data);
                } else {
                    // 2. FILTRO MEJORADO: 
                    // Buscamos el ID del usuario en múltiples lugares posibles del JSON
                    const misDonaciones = data.filter(item => {
                        const idEnDonacion = Number(item.idDonation?.idUser?.idUser);
                        const idEnRaiz = Number(item.idUser?.idUser); // Por si la API cambia la estructura
                        
                        return idEnDonacion === userId || idEnRaiz === userId;
                    });
                    
                    setActividad(misDonaciones);
                }
                setError(null);
            } catch (err) {
                console.error("Error al obtener logística:", err);
                setError("Error de conexión: No se pudieron sincronizar tus donaciones.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogisticaCompleta();
    }, [isAdmin, userId, user, navigate]);

    if (!user) return null;

    return (
        <Container className="py-5">
            <Row>
                <Col md={4}>
                    <Card className="shadow-lg p-4 text-center border-0 mb-4">
                        <div className="avatar-circle mx-auto mb-3" style={{
                            width: '70px', height: '70px', background: '#198754', 
                            color: 'white', borderRadius: '50%', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
                        }}>
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="text-capitalize">{user.email?.split('@')[0]}</h4>
                        <Badge bg={isAdmin ? "dark" : "primary"} className="mb-3">
                            {user.idUserType?.userType?.toUpperCase()}
                        </Badge>
                        <p className="text-muted small">{user.email}</p>
                        <hr />
                        <Button variant="success" onClick={() => navigate('/products')} className="w-100">
                            Nueva Donación
                        </Button>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="shadow-lg p-4 border-0">
                        <h4 className="mb-4 fw-bold">
                            {isAdmin ? " Panel General de Logística" : " Mis Donaciones Recientes"}
                        </h4>

                        {error && <Alert variant="danger">{error}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="success" />
                                <p className="mt-2 text-muted">Buscando tus donaciones en el servidor...</p>
                            </div>
                        ) : actividad.length > 0 ? (
                            <Table responsive hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fecha</th>
                                        {isAdmin && <th>Donante</th>}
                                        <th>Causa</th>
                                        <th>Cantidad / Tipo</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actividad.map((item, index) => (
                                        <tr key={item.idLogistic || index}>
                                            <td>{item.idDonation?.date ? new Date(item.idDonation.date).toLocaleDateString() : 'Hoy'}</td>
                                            {isAdmin && <td className="small">{item.idDonation?.idUser?.email}</td>}
                                            <td>
                                                <div className="fw-bold">{item.idNeeds?.needs || "Donación General"}</div>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-success">{item.idDonation?.amount}</span>
                                                <div className="small text-muted">
                                                    {item.idDonation?.idDonationType?.donationType}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={item.idDonation?.idDonationState?.idDonationState === 2 ? "success" : "warning"}>
                                                    {item.idDonation?.idDonationState?.donationState || "En camino"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-5 bg-light rounded">
                                <p className="text-muted">Parece que aún no tienes donaciones registradas.</p>
                                <Button variant="link" onClick={() => navigate('/products')}>Ir a ver causas disponibles</Button>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;