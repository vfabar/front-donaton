import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Text from '../components/atoms/Text.jsx';
import DynamicForm from '../components/molecules/DynamicForm.jsx';
import Button from '../components/atoms/Button.jsx';
import "../styles/MoreInfo.css"; // Sugiero renombrar a MoreInfo.css luego

function MoreInfo() {
    const initialFormData = {
        name: '',
        email: '',
        mensaje: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    const formInputs = [
        {
            id: 'name',
            type: 'text',
            label: 'Nombre Completo',
            placeholder: 'Ej. Juan Pérez',
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
        },
        {
            id: 'email',
            type: 'email',
            label: 'Correo Electrónico',
            placeholder: 'tu@email.com',
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value }),
        },
        {
            id: 'mensaje',
            type: 'textarea',
            label: '¿En qué podemos ayudarte?',
            placeholder: 'Cuéntanos tu duda o incidencia con el pago...',
            rows: 4,
            value: formData.mensaje,
            onChange: (e) => setFormData({ ...formData, mensaje: e.target.value }),
        },
    ];

    const handleSubmit = () => {
        alert("Gracias por contactarnos. Nuestro equipo técnico revisará tu caso a la brevedad.");
    };

    return (
        <Container fluid className="info-page-container px-0 position-relative" style={{ zIndex: 1 }}>
            {/* Sección de Texto Informativo */}
            <div className="info-hero-section text-center">
                <Container>
                    <Text variant="h1" className="info-title">Sobre Donatón</Text>
                    <Text variant="p" className="info-subtitle">
                        Estamos trabajando para mejorar tu experiencia de solidaridad.
                    </Text>
                </Container>
            </div>

            <Container className="info-content-wrapper py-5">
                <Row className="justify-content-center">
                    <div className="info-card shadow-sm p-5 mb-5 bg-white">
                        <Text variant="h2" className="text-success mb-4">¿Por qué existe Donatón?</Text>
                        <Text variant="p" className="lead">
                            Nuestra plataforma nació con la convicción de que <strong>la solidaridad no debe tener barreras</strong>. 
                            Donatón actúa como un puente digital entre causas urgentes y personas dispuestas a generar un cambio real.
                        </Text>
                        <hr />
                        <Text variant="p">
                            Nos dedicamos a centralizar proyectos de ayuda social, desde refugios de animales hasta bancos de alimentos, 
                            asegurando que los recursos lleguen de manera eficiente. Cada proyecto en nuestra lista es verificado 
                            para garantizar que tu apoyo tenga el máximo impacto posible.
                        </Text>
                        <div className="mt-4 d-flex justify-content-around text-center">
                            <div><h4 className="text-danger">100%</h4><p>Transparente</p></div>
                            <div><h4 className="text-danger">+50</h4><p>Causas Activas</p></div>
                            <div><h4 className="text-danger">Directo</h4><p>Sin Intermediarios</p></div>
                        </div>
                    </div>

                    <Col lg={6} className="mt-4">
                        <div className="contact-form-box p-4 shadow-lg bg-white">
                            <Text variant="h4" className="mb-4 text-center">Formulario de Soporte</Text>
                            <DynamicForm inputs={formInputs} />
                            <div className="d-flex gap-3 justify-content-center mt-4">
                                <Button variant="success" onClick={handleSubmit} className="px-5">
                                    Enviar Reporte
                                </Button>
                                <Button variant="outline-danger" onClick={() => setFormData(initialFormData)}>
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default MoreInfo;