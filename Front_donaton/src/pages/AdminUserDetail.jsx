import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  Table,
  Alert
} from 'react-bootstrap';

import { useParams, useNavigate } from 'react-router-dom';

import usersApi from '../api/objects/user';
import Button from '../components/atoms/Button';

function AdminUserDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const data = await usersApi.getById(id);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Usuario no encontrado
        </Alert>
      </Container>
    );
  }
  const donations = user.donations || [];
  const totalDonaciones = donations.length;
  const totalMonto = donations.reduce(
    (acc, donation) => acc + (donation.amount || 0),
    0
  );
  return (
    <Container className="py-5">
      <Button
        variant="outline-dark"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </Button>
      <Card className="shadow-lg border-0">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h2 className="mb-4">
                Información del Usuario
              </h2>
              <p>
                <strong>ID:</strong> {user.idUser}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Rol:</strong>{" "}
                <Badge bg={
                  user.idUserType?.userType?.toLowerCase() === "admin"
                    ? "danger"
                    : "primary"
                }>
                  {user.idUserType?.userType}
                </Badge>
              </p>
            </Col>
            <Col md={6}>
              <h2 className="mb-4">
                Resumen
              </h2>
              <Card className="bg-light">
                <Card.Body>
                  <h5>
                    Total Donaciones
                  </h5>
                  <h2>
                    {totalDonaciones}
                  </h2>
                  <hr />
                  <h5>
                    Monto Donado
                  </h5>
                  <h2>
                    ${totalMonto.toLocaleString()}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <hr className="my-4" />
          <h3>
            Historial de Donaciones
          </h3>
          {donations.length === 0 ? (
            <Alert variant="warning">
              Este usuario no posee donaciones.
            </Alert>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.idDonation}>
                    <td>{donation.idDonation}</td>
                    <td>
                      {new Date(
                        donation.date
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      {donation.idDonationType?.donationType}
                    </td>
                    <td>
                      {donation.amount}
                    </td>
                    <td>
                      {donation.idDonationState?.donationState}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminUserDetail;