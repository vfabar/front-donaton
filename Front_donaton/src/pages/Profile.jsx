import React from 'react';
import { Container, Card, Row, Col, Button, Table } from 'react-bootstrap'; // Añadimos Table
import { useNavigate } from 'react-router-dom';
import "../styles/Auth.css"; 

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center py-5">
            <Row className="justify-content-center w-100"> 
                {/* Lado Izquierdo: Información del Perfil */}
                <Col md={4}>
                    <Card className="auth-card shadow-lg p-4 text-center mb-4">
                        <div className="profile-avatar mb-3">
                            <div className="avatar-circle">{user.name.charAt(0)}</div>
                        </div>
                        <h2 className="auth-title mb-1">{user.name}</h2>
                        <p className="text-muted mb-4">{user.email}</p>
                        
                        <Card className="mb-4 text-start bg-light border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <strong>Impacto Total:</strong> 
                                    <span className="badge bg-danger fs-6">{user.vidasAyudadas || 0}</span>
                                </div>
                            </Card.Body>
                        </Card>
                        <Button variant="outline-success" onClick={() => navigate('/products')} className="w-100">
                            Donar más
                        </Button>
                    </Card>
                </Col>

                {/* Lado Derecho: Historial de Donaciones */}
                <Col md={8}>
                    <Card className="auth-card shadow-lg p-4 h-100">
                        <h3 className="text-start mb-4">Mi Historial de Impacto</h3>
                        {user.historial && user.historial.length > 0 ? (
                            <Table responsive hover className="text-start">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Causa</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.historial.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.fecha}</td>
                                            <td className="fw-bold">{item.causa}</td>
                                            <td className="text-success">+{item.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">Aún no has realizado donaciones.</p>
                                <Button variant="link" onClick={() => navigate('/products')}>Ver causas disponibles</Button>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;