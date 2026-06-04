import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

import needsApi from '../api/objects/needs';
import NeedDashboardCard from '../components/organisms/NeedDashboardCard';

function Dashboard() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const data = await needsApi.getAll();
        setNeeds(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNeeds();
  }, []);
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  return (
    <Container className="py-5">
      <h1 className="mb-4">
        Dashboard de Causas
      </h1>
      <Row>
        {needs.map((need) => (
          <NeedDashboardCard
            key={need.idNeeds}
            need={need}
          />
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;