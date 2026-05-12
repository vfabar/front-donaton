import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { users } from '../data/Users';
import "../styles/Auth.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // <--- GUARDAR SESIÓN
            navigate('/profile'); 
        } else {
            alert("Error...");
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center">
            <Card className="auth-card shadow-lg p-4">
                <Card.Body>
                    <h2 className="text-center mb-4 auth-title">Iniciar Sesión</h2>
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