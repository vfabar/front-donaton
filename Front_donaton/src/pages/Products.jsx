import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner, Alert, Badge } from 'react-bootstrap';
import needsApi from '../api/objects/needs'; 
import ProductCard from '../components/organisms/ProductCard';
import "../styles/Productos.css";

function Products() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const data = await needsApi.getAll();
        setNeeds(data);
      } catch (err) {
        console.error("Error al cargar necesidades:", err);
        setError("No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };
    fetchNeeds();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Cargando proyectos solidarios...</p>
      </Container>
    );
  }

  // Separamos las necesidades por estado
  const enProgreso = needs.filter(item => item.id_needs_state === 1);
  const superadas = needs.filter(item => item.id_needs_state === 2);

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center mb-4">
        <h1 className="me-3">Proyectos de Ayuda</h1>
        <Badge bg="success">{enProgreso.length} Activos</Badge>
      </div>

      {/* SECCIÓN: EN PROGRESO */}
      <h3 className="mb-4 text-primary">Causas Urgentes</h3>
      <Row className="products-row mb-5">
        {enProgreso.length > 0 ? (
          enProgreso.map((item) => (
            <ProductCard key={item.idNeeds} product={item} />
          ))
        ) : (
          <p className="text-muted ms-3">No hay causas urgentes en este momento.</p>
        )}
      </Row>

      <hr className="my-5" />

      {/* SECCIÓN: SUPERADAS */}
      <h3 className="mb-4 text-success">Logros Alcanzados (Superadas)</h3>
      <Row className="products-row">
        {superadas.map((item) => (
          <div key={item.idNeeds} style={{ opacity: 0.8, filter: 'grayscale(30%)' }} className="col-md-4 col-sm-6">
            <ProductCard product={item} />
          </div>
        ))}
      </Row>
    </Container>
  );
}

export default Products;