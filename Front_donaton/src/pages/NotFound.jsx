import React from 'react';
import { Container } from 'react-bootstrap';
import Image from '../components/atoms/Image';

const image = {
    src: 'https://pm1.aminoapps.com/7827/fcf7a54ee21f7e9a3740da86e2dce8bd684ed4b8r1-1200-1353v2_uhq.jpg',
    alt: 'esta pagina es invisible',
}

function NotFound() {
  return (
    <Container className="my-5">
      <h1>esta pagina es invisible</h1>
      <p>¿Estás seguro de que era aquí?</p>
      
      <Image src={image.src} alt={image.alt} className="" />
    </Container>
  );
}

export default NotFound;
