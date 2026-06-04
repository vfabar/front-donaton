import React, { useState, useEffect } from 'react';
import {
  Container,
  Spinner,
  Alert,
  Table,
  Badge
} from 'react-bootstrap';

import logisticApi from '../api/objects/logistic';

function DonationManagement() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await logisticApi.getAll();
        setDonations(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las donaciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }
  return (
    <Container className="py-5">
      <h1 className="mb-4">
        Gestión de Donaciones
      </h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Donación</th>
            <th>Cantidad</th>
            <th>Causa</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((item) => {
            const donation = item.idDonation;
            return (
              <tr key={item.idLogistic}>
                <td>
                  {donation.idDonation}
                </td>
                <td>
                  {donation.idUser.email}
                </td>
                <td>
                  {donation.idDonationType.donationType}
                </td>
                <td>
                  {donation.amount}
                </td>
                <td>
                  {item.idNeeds.needs}
                </td>
                <td>
                  {new Date(
                    donation.date
                  ).toLocaleDateString()}
                </td>
                <td>
                  <Badge
                    bg={
                      donation.idDonationState.donationState
                        .toLowerCase()
                        .includes("entregado")
                        ? "success"
                        : "warning"
                    }
                  >
                    {donation.idDonationState.donationState}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default DonationManagement;