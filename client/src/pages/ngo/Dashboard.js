import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUtensils, FaMapMarkedAlt, FaHandHoldingHeart, FaBuilding, FaList, FaLocationArrow } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import { formatRelativeTime, formatFoodType, formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import anime from 'animejs';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    availableFoods: 0,
    pendingPickups: 0,
    completedDonations: 0
  });
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [pendingPickups, setPendingPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Animate dashboard elements
    anime({
      targets: '.dashboard-welcome',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.stat-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get user's location
        const userLocation = user?.location?.coordinates;
        
        // Fetch available food listings (nearby)
        const foodRes = await api.get('/api/food', {
          params: {
            lat: userLocation ? userLocation[1] : undefined,
            lng: userLocation ? userLocation[0] : undefined,
            distance: 10 // 10km radius
          }
        });
        
        setNearbyFoods(foodRes.data.data || []);
        
        // Fetch NGO's pending pickups
        const donationsRes = await api.get('/api/donations/ngo');
        const pending = (donationsRes.data.data || []).filter(d => d.status === 'scheduled');
        setPendingPickups(pending);
        
        // Set stats
        setStats({
          availableFoods: foodRes.data.count || 0,
          pendingPickups: pending.length,
          completedDonations: (donationsRes.data.data || []).filter(d => d.status === 'completed').length
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
        
        // Animate food cards after loading
        anime({
          targets: '.food-card, .pickup-card',
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(100),
          easing: 'easeOutQuad',
          duration: 800
        });
      }
    };
    
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);
  
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <div className="dashboard-welcome mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="fw-bold">
              <FaBuilding className="text-success me-2" />
              Welcome, {user?.organization || user?.name}
            </h1>
            <p className="lead text-muted">Manage food pickups and track your impact</p>
          </Col>
          <Col xs="auto">
            <Link to="/ngo/pickups">
              <Button variant="success" className="d-flex align-items-center">
                <FaList className="me-2" /> View All Available Food
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      
      <Row className="mb-4">
        <Col md={4} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaUtensils />}
            count={stats.availableFoods}
            label="Available Food Donations"
            color="primary"
            iconBg="light"
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaLocationArrow />}
            count={stats.pendingPickups}
            label="Pending Pickups"
            color="warning"
            iconBg="light"
          />
        </Col>
        
        <Col md={4} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaHandHoldingHeart />}
            count={stats.completedDonations}
            label="Completed Donations"
            color="success"
            iconBg="light"
          />
        </Col>
      </Row>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Row>
        <Col lg={7} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">
                <FaMapMarkedAlt className="text-success me-2" />
                Nearby Food Donations
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="nearby-foods" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {nearbyFoods.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="mb-0">No food donations available nearby.</p>
                  </div>
                ) : (
                  nearbyFoods.map((food, index) => (
                    <div key={food._id} className="food-card p-3 border-bottom">
                      <Row className="align-items-center">
                        <Col xs={3} className="mb-2 mb-sm-0">
                          <div style={{ height: '70px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                            {food.images && food.images.length > 0 ? (
                              <img 
                                src={`/uploads/${food.images[0]}`} 
                                alt={food.title} 
                                className="img-fluid h-100 w-100 object-fit-cover"
                              />
                            ) : (
                              <div className="bg-light d-flex justify-content-center align-items-center h-100">
                                <FaUtensils size={20} className="text-secondary" />
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col xs={9} sm={6} className="mb-2 mb-sm-0">
                          <h6 className="mb-1 text-truncate">{food.title}</h6>
                          <div className="mb-1">
                            <Badge bg={formatFoodType(food.foodType).color} className="me-2">
                              {food.foodType}
                            </Badge>
                            <small className="text-muted">
                              {formatRelativeTime(food.createdAt)}
                            </small>
                          </div>
                          <small className="text-muted d-block">
                            Qty: {food.quantity}
                          </small>
                        </Col>
                        <Col xs={12} sm={3} className="text-sm-end">
                          <Link to={`/food/${food._id}`}>
                            <Button variant="outline-success" size="sm">View Details</Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
            <Card.Footer className="bg-white text-center py-3">
              <Link to="/ngo/pickups">
                <Button variant="outline-success">View All Available Food</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={5} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">
                <FaLocationArrow className="text-success me-2" />
                Upcoming Pickups
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="pending-pickups" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {pendingPickups.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="mb-0">No pickups scheduled yet.</p>
                  </div>
                ) : (
                  pendingPickups.map((pickup, index) => (
                    <div key={pickup._id} className="pickup-card p-3 border-bottom">
                      <h6 className="mb-2">{pickup.foodDetails?.title || 'Food Donation'}</h6>
                      <div className="mb-2">
                        <Badge bg="warning" className="me-2">Scheduled</Badge>
                        <small className="text-muted">
                          Pickup time: {formatDateTime(pickup.pickupTime)}
                        </small>
                      </div>
                      <p className="mb-2 text-muted small">
                        From: {pickup.foodDetails?.donorName || 'Anonymous Donor'}
                      </p>
                      <div className="d-flex justify-content-between">
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => {
                            // View pickup details
                            alert('This would show pickup details');
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => {
                            // Mark as complete
                            alert('This would mark pickup as complete');
                          }}
                        >
                          Mark as Picked Up
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
            <Card.Footer className="bg-white text-center py-3">
              <Link to="/ngo/donations">
                <Button variant="outline-success">Manage All Pickups</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;