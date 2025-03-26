import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUtensils, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';

const Stats = ({ stats, loading }) => {
  return (
    <section className="stats-section py-4 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={4} className="mb-3">
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="stat-icon text-primary">
                  <FaUtensils />
                </div>
                <h3>{loading ? '...' : stats.totalFoods}</h3>
                <p className="mb-0 text-muted">Meals Shared</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="stat-icon text-success">
                  <FaHandHoldingHeart />
                </div>
                <h3>{loading ? '...' : stats.totalGivers}</h3>
                <p className="mb-0 text-muted">Food Givers</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="stat-icon text-warning">
                  <FaUsers />
                </div>
                <h3>{loading ? '...' : stats.totalTakers}</h3>
                <p className="mb-0 text-muted">Food Takers</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Stats;