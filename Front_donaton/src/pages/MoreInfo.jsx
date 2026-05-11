import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Text from '../components/atoms/Text.jsx';
import DynamicForm from '../components/molecules/DynamicForm.jsx';
import Button from '../components/atoms/Button.jsx';
import "../styles/Contact.css";

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
            label: 'Nombre',
            placeholder: 'Ingresa tu nombre',
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
        },
        {
            id: 'email',
            type: 'email',
            label: 'Correo',
            placeholder: 'Ingresa tu correo',
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value }),
        },
        {
            id: 'mensaje',
            type: 'textarea',
            label: 'Mensaje',
            placeholder: 'Ingrese el mensaje',
            rows: 3,
            value: formData.mensaje,
            onChange: (e) => setFormData({ ...formData, mensaje: e.target.value }),
        },
    ];

    const handleSubmit = () => {
        const message = `Nombre: ${formData.name}\nCorreo: ${formData.email}\nMensaje: ${formData.mensaje}\nSe ha enviado el mensaje`;
        alert(message);
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    return (
        <Container className="contact-container">
            <Text variant="h1" className="contact-title">Contacto</Text>
            <Text variant="p" className="contact-description">
                Llena el formulario para poder contactarte
            </Text>

            <DynamicForm inputs={formInputs} />

            <div className="contact-buttons">
                <Button variant="primary" onClick={handleSubmit} className="me-2">
                    Enviar
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                    Limpiar
                </Button>
            </div>
        </Container>
    );
}

export default MoreInfo;
