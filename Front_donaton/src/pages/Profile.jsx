import React from 'react';
import { Container, Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    
    // Obtenemos el usuario del localStorage (guardado al hacer login)
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        navigate('/login');
        return null;
    }
    const userName = user.email ? user.email.split('@')[0] : "Usuario";

    // El nombre se extrae del email porque el Back no tiene campo "nombre"
    const rawRole = user.idUserType?.userType || 'usuario';
    const roleName = rawRole.toLowerCase();

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center py-5">
            <Row className="justify-content-center w-100"> 
                <Col md={4}>
                    <Card className="auth-card shadow-lg p-4 text-center mb-4">
                        <div className="profile-avatar mb-3">
                            <div className="avatar-circle">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <h2 className="auth-title mb-1 text-capitalize">{userName}</h2>
                        <p className="text-muted">{user.email}</p>
                        
                        {/* Badge basado en la relación idUserType del Backend */}
                        <Badge 
                            bg={roleName === 'admin' ? 'dark' : 'primary'} 
                            className="mb-3 text-uppercase">
                            Rol: {rawRole} 
                        </Badge>
                        
                        <Card className="mb-4 text-start bg-light border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <strong>ID de Usuario:</strong> 
                                    <span>#{user.idUser}</span>
                                </div>
                            </Card.Body>
                        </Card>
                        <Button variant="outline-success" onClick={() => navigate('/products')} className="w-100">
                            Ir a Donaciones
                        </Button>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="auth-card shadow-lg p-4 h-100">
                        <h3 className="text-start mb-4">Actividad Reciente</h3>
                        {/* El Backend actual no tiene historial en el objeto User. 
                            Se deja el estado vacío para evitar errores hasta que conectes la API de Donaciones.
                        */}
                        {user.historial && user.historial.length > 0 ? (
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Causa</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.historial.map((item) => (
                                        <tr key={item.idUser}>
                                            <td>{item.fecha}</td>
                                            <td className="fw-bold">{item.causa}</td>
                                            <td className="text-success">Completada</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">No hay actividad registrada en la base de datos.</p>
                                <Button variant="link" onClick={() => navigate('/products')}>Ver necesidades actuales</Button>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;