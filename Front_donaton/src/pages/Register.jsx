import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Auth.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

// Dentro de handleRegister en Register.jsx
const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
        ...formData,
        vidasAyudadas: 0,
        historial: [] // Inicializamos la lista vacía
    };
    // En una app real esto iría a la base de datos, 
    // aquí podrías guardarlo en localStorage para simular que ya existe.
    localStorage.setItem('user', JSON.stringify(newUser)); 
    alert("¡Cuenta creada y sesión iniciada!");
    navigate('/profile');
};

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center">
            <Card className="auth-card shadow-lg p-4">
                <Card.Body>
                    <h2 className="text-center mb-4 auth-title red-accent">Unirse a Donatón</h2>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ej. Juan Pérez" 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="tu@email.com" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Crea una contraseña" 
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required 
                            />
                        </Form.Group>

                        <Button variant="danger" type="submit" className="w-100 mb-3 btn-auth red-btn">
                            Crear cuenta
                        </Button>
                    </Form>
                    <div className="text-center">
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/login" className="auth-link">Inicia sesión</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;