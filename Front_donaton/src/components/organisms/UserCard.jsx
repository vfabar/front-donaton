import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserCard({ user }) {

  const navigate = useNavigate();

  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Card.Body>
          <Card.Text>
            <strong>Correo:</strong><br />
            {user.email}
          </Card.Text>
          <Card.Text>
            <strong>Rol:</strong><br />
            {user.idUserType?.userType}
          </Card.Text>
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/admin/users/${user.idUser}`)
            }
          >
            Ver Perfil
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default UserCard;