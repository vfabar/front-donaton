import React from 'react';
import { Container } from 'react-bootstrap';
import Image from '../components/atoms/Image';

const image = {
    src: 'https://img.magnific.com/vector-gratis/pagina-error-404-distorsion_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80',
    alt: 'esta pagina no existe',
}

function NotFound() {
  return (
    <Container className="my-5">
      <h1>esta pagina no existe</h1>
      <p>¿Estás seguro de que era aquí?</p>
      
      <Image src={image.src} alt={image.alt} className="" />
    </Container>
  );
}

export default NotFound;
