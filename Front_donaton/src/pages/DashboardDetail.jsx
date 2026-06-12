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
        const filtered = data.filter(item => {
          const targetId = parseInt(id);
          if (typeof item.idNeeds === 'object' && item.idNeeds !== null) {
            return item.idNeeds.idNeeds === targetId;
          }
          // Soporte para id_needs o idNeeds directo de Express
          return item.idNeeds === targetId || item.id_needs === targetId;
        });
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
  
  const firstRecord = records[0];
  const needName = firstRecord.idNeeds?.needs || firstRecord.Needs?.needs || "Detalle de la Causa";
  
const monetaryDonations = records.filter(item => {
const donationObj = item.idDonation || item.Donation;
  const typeObj = donationObj?.idDonationType || donationObj?.DonationType;
  const typeStr = typeObj?.donationType || "";
    return typeStr.toLowerCase().includes('monet');
  });

const objectDonations = records.filter(item => {
  const donationObj = item.idDonation || item.Donation;
  const typeObj = donationObj?.idDonationType || donationObj?.DonationType;
  const typeStr = typeObj?.donationType || "";
    return !typeStr.toLowerCase().includes('monet');
  });

const totalMoney = monetaryDonations.reduce((sum, item) => {
    const donationObj = item.idDonation || item.Donation;
    const amount = donationObj?.amount || 0;
    return sum + amount;
  }, 0);
  
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
          {records.map((item) => {
            // Unificamos el acceso al objeto Donation sin importar las mayúsculas del Backend
            const donation = item.idDonation || item.Donation;
            const donationType = donation?.idDonationType || donation?.DonationType;
            const donationState = donation?.idDonationState || donation?.DonationState;
            const userObj = donation?.idUser || donation?.User;
            
            return (
              <tr key={item.idLogistic}>
                <td>{userObj?.email || "Anónimo / No registrado"}</td>
                <td>{donationType?.donationType || "No especificado"}</td>
                <td>{donation?.amount || 0}</td>
                <td>{donationState?.donationState || "Pendiente"}</td>
                <td>
                  {donation?.date 
                    ? new Date(donation.date).toLocaleDateString() 
                    : "Sin fecha"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardDetail;