import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';

import usersApi from '../api/objects/user';
import UserCard from '../components/organisms/UserCard';

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Cargando usuarios...</p>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }
  return (
    <Container className="my-5">
      <div className="d-flex align-items-center mb-4">
        <h1 className="me-3">Administración de Usuarios</h1>
        <Badge bg="primary">
          {users.length} usuarios
        </Badge>
      </div>
      <Row>
        {users.map((user) => (
          <UserCard
            key={user.idUser}
            user={user}
          />
        ))}
      </Row>
    </Container>
  );
}

export default AdminUsers;