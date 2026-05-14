import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../api/objects/user'; // Importamos nuestro objeto de la API
import "../styles/Auth.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Para mostrar errores de la API
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // 1. Obtenemos todos los usuarios de la API (Logística por defecto)
            const allUsers = await userApi.getAll();
            
            // 2. Buscamos el usuario que coincida
            const foundUser = allUsers.find(u => u.email === email && u.password === password);
            
            if (foundUser) {
                // Guardamos el objeto tal cual viene del Back
                // Viene con: idUser, email, password, idUserType { idUserType, userType }
                localStorage.setItem('user', JSON.stringify(foundUser));
                navigate('/profile');
            } else {
                setError("Credenciales incorrectas. Inténtalo de nuevo.");
            }
        } catch (err) {
            console.error("Error en el login:", err);
            setError("No se pudo conectar con el servidor.");
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center">
            <Card className="auth-card shadow-lg p-4">
                <Card.Body>
                    <h2 className="text-center mb-4 auth-title">Iniciar Sesión</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="tu@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="******" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 mb-3 btn-auth">
                            Entrar
                        </Button>
                    </Form>
                    <div className="text-center">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/register" className="auth-link">Regístrate aquí</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;