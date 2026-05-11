import React from 'react';
import { Container, Row } from 'react-bootstrap';
import products from '../data/Products';
import ProductCard from '../components/organisms/ProductCard';
import "../styles/Productos.css";

function Products() {
  return (
    <Container className="my-5">
      <h1>Proyectos realizados</h1>
      <Row className="products-row">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>
    </Container>
  );
}

export default Products;
