import React from 'react';
import { Card } from 'react-bootstrap';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  // 1. Lógica para asignar imagen según el tipo de necesidad
  // Si no hay imagen en el objeto, usamos una de stock según el tipo
const getPlaceholderImage = (type) => {
  
  const images = {
    'Comida': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400',
    'Salud': 'https://www.tubotiquin.cl/cdn/shop/articles/que-debe-tener-un-botiquin-de-primeros-auxilios_592e319d-c15b-4ad0-b408-ff0e87020015.webp?v=1780536762',
    'Refugio': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400',
    'Ropa': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=400',
    'Agua e Higiene': 'https://cospec.com.ar/wp-content/uploads/2022/03/Dia-mundial-del-agua_-22-de-marzo-de-2022.jpg'
  };
  
  // Si no encuentra el tipo exacto, usa una imagen genérica de ayuda social
  return images[type] || 'https://img.magnific.com/foto-gratis/turistas-suben-colina-al-amanecer_1150-19692.jpg?semt=ais_hybrid&w=740&q=80';
};

  // 2. Extraemos los datos del JSON anidado de tu API
  const title = product.needs; // En la API es "needs" no "name"
  const type = product.NeedsType?.needsType || 'General';

// Usamos "Ubication", "Distric" y "Region" (ojo con la falta de la 't' final en Distric según tu JSON)
  const districtName = product.Ubication?.Distric?.distric || 'Dirección no especificada';
  const regionName = product.Ubication?.Distric?.Region?.region || '';
  const location = regionName ? `${districtName}, ${regionName}` : districtName;
  
  const state = product.idNeedsState?.needsState;
  
  // Construimos una descripción dinámica ya que la API no trae el campo "description"
  const description = `Estado: ${state}. Ubicación: ${location}. Esta causa busca recolectar ${title.toLowerCase()} para la comunidad.`;

  const cardImage = product.image || getPlaceholderImage(type);

  return (
    <Card className="m-2 product-card shadow-sm h-100">
      <div className="position-relative">
        <Image src={cardImage} alt={title} className="card-img-top" />
        <span className="badge bg-success position-absolute top-0 end-0 m-2">
          {type}
        </span>
      </div>
      <Card.Body className="d-flex flex-column">
        <CardBody
          title={title}
          description={description}
        />
        <div className="mt-auto">
          <hr />
          <Button 
            variant={product.idNeedsState?.idNeedsState === 2 ? "secondary" : "primary"} 
            className="w-100" 
            onClick={() => navigate(`/products/${product.idNeeds}`)}
          >
            {product.idNeedsState?.idNeedsState === 2 ? "Ver Logro" : "Ayudar Ahora"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;