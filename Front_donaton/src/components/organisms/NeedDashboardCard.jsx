import { Card, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NeedDashboardCard({ need }) {
  const navigate = useNavigate();
  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Card.Body>
          <Card.Title>
            {need.needs}
          </Card.Title>
          <Badge
            bg={
              need.idNeedsState.idNeedsState === 1
                ? "warning"
                : "success"
            }
          >
            {need.idNeedsState.needsState}
          </Badge>
          <hr />
          <Button
            className="w-100"
            onClick={() =>
              navigate(
                `/admin/dashboard/${need.idNeeds}`
              )
            }
          >
            Ver Donaciones
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default NeedDashboardCard;