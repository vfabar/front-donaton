import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import products from '../data/Products.js';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import { useNavigate } from 'react-router-dom';
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <Container className="product-detail-container">
        <h1>Producto no encontrado</h1>
      </Container>
    );
  }

  return (
    <Container className="product-detail-container">
      <Button variant="primary" onClick={() => navigate(`/products`)}>
          Volver
        </Button>
      <Card>
        <Image src={product.image} alt={product.name} className="card-img-top" />
        <Card.Body>
          <Text variant="h2">{product.name}</Text>
          <Text variant="p">{product.description}</Text>
          <Text>enlace del proyecto:</Text>

        <Button variant="primary" onClick={() =>window.open(product.url, "_blank")}>
          Ver detalles
        </Button>

        </Card.Body> 
        
      </Card>
    </Container>
  );
}

export default ProductDetail;
