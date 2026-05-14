import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../api/objects/user';
import userTypeApi from '../api/objects/user-types';
import "../styles/Auth.css";

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [defaultUserTypeId, setDefaultUserTypeId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Cargar los roles solo para encontrar el ID del rol "usuario"
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await userTypeApi.getAll();
                // Buscamos el rol que NO sea admin (ajusta 'usuario' según tu DB)
                const userRole = data.find(r => 
                    r.userType.toLowerCase() === 'usuario' || 
                    r.userType.toLowerCase() === 'user'
                );
                
                if (userRole) {
                    setDefaultUserTypeId(userRole.idUserType);
                } else if (data.length > 0) {
                    // Fallback: si no encuentra "usuario", usa el primero de la lista
                    setDefaultUserTypeId(data[0].idUserType);
                }
            } catch (err) {
                console.error("Error cargando roles base", err);
            }
        };
        fetchRoles();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden");
        }

        if (!defaultUserTypeId) {
            return setError("Error de configuración de roles. Intente más tarde.");
        }

        try {
            const newUser = {
                email: formData.email,
                password: formData.password,
                idUserType: {
                    idUserType: defaultUserTypeId // Asignado automáticamente
                }
            };

            await userApi.createUser(newUser);
            alert("¡Cuenta creada con éxito!");
            navigate('/login');
        } catch (err) {
            setError("Error al registrarse. El correo podría estar en uso.");
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center py-5">
            <Card className="auth-card shadow-lg p-4">
                <Card.Body>
                    <h2 className="text-center mb-4 auth-title">Crear Cuenta</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control 
                                type="email" 
                                required 
                                placeholder="ejemplo@correo.com"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </Form.Group>

                        {/* El Select ha sido eliminado por seguridad */}

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                placeholder="Mínimo 6 caracteres"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                placeholder="Repite tu contraseña"
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 mb-3 btn-auth">
                            Registrarse
                        </Button>
                    </Form>
                    <div className="text-center">
                        <Link to="/login" className="auth-link">Ya tengo cuenta</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;