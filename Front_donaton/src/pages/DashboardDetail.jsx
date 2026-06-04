import React, { useState, useEffect } from 'react';
import {
  Container,
  Spinner,
  Card,
  Table,
  Alert
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import logisticApi from '../api/objects/logistic';
import Button from '../components/atoms/Button';

function DashboardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await logisticApi.getAll();
        const filtered = data.filter(
          item => item.idNeeds.idNeeds === parseInt(id)
        );
        setRecords(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (records.length === 0) {
    return (
      <Container className="py-5">
        <Button
          variant="outline-dark"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </Button>
        <Alert className="mt-4" variant="warning">
          Esta causa aún no tiene donaciones.
        </Alert>
      </Container>
    );
  }
  const needName = records[0].idNeeds.needs;
  const monetaryDonations = records.filter(
    item =>
      item.idDonation.idDonationType.donationType
        .toLowerCase()
        .includes('monet')
  );
  const objectDonations = records.filter(
    item =>
      !item.idDonation.idDonationType.donationType
        .toLowerCase()
        .includes('monet')
  );
  const totalMoney = monetaryDonations.reduce(
    (sum, item) =>
      sum + item.idDonation.amount,
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
      <h1>{needName}</h1>
      <Card className="mb-4">
        <Card.Body>
          <h4>
            Total Dinero Recaudado
          </h4>
          <h2>
            ${totalMoney.toLocaleString()}
          </h2>
          <hr />
          <h4>
            Objetos Donados
          </h4>
          <h2>
            {objectDonations.length}
          </h2>
        </Card.Body>
      </Card>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.idLogistic}>
              <td>
                {item.idDonation.idUser.email}
              </td>
              <td>
                {item.idDonation.idDonationType.donationType}
              </td>
              <td>
                {item.idDonation.amount}
              </td>
              <td>
                {item.idDonation.idDonationState.donationState}
              </td>
              <td>
                {new Date(
                  item.idDonation.date
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardDetail;