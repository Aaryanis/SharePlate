import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaListAlt, FaStar, FaHistory } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import RatingStars from '../components/common/RatingStars';

const GiverDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('active');
  const [activeFoods, setActiveFoods] = useState([]);
  const [pastFoods, setPastFoods] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    totalShared: 0,
    totalRatings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message from another page (e.g., food form)
    if (location.state?.success) {
      setSuccessMessage(location.state.message);
      
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all food listings by the giver
      const foodRes = await api.get('/api/food?giver=' + user._id);
      
      // Separate active and past (unavailable) foods
      const active = [];
      const past = [];
      
      foodRes.data.data.forEach(food => {
        if (food.isAvailable) {
          active.push(food);
        } else {
          past.push(food);
        }
      });
      
      setActiveFoods(active);
      setPastFoods(past);
      
      // Fetch ratings for the giver
      const ratingsRes = await api.get(`/api/ratings/giver/${user._id}`);
      setRatings(ratingsRes.data.data);
      
      // Set stats
      setStats({
        totalShared: active.length + past.length,
        totalRatings: ratingsRes.data.count,
        averageRating: ratingsRes.data.averageRating
      });
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkUnavailable = async (foodId) => {
    try {
      await api.put(`/api/food/${foodId}/unavailable`);
      
      // Update the local state
      const updatedFood = activeFoods.find(food => food._id === foodId);
      
      if (updatedFood) {
        updatedFood.isAvailable = false;
        setActiveFoods(activeFoods.filter(food => food._id !== foodId));
        setPastFoods([updatedFood, ...pastFoods]);
      }
      
      setSuccessMessage('Food marked as unavailable');
    } catch (err) {
      setError('Failed to update food status');
      console.error('Error marking food as unavailable:', err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Giver Dashboard</h1>
      
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h3>{stats.totalShared}</h3>
              <p className="text-muted mb-0">Food Items Shared</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h3>{stats.totalRatings}</h3>
              <p className="text-muted mb-0">Total Ratings Received</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-center mb-2">
                <RatingStars rating={stats.averageRating} size="lg" />
              </div>
              <p className="text-muted mb-0">Average Rating ({stats.averageRating})</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Link to="/giver/food/add">
            <Button variant="success">
              <FaPlus className="me-2" /> Share New Food
            </Button>
          </Link>
        </Col>
      </Row>
      
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="active" title={<span><FaListAlt className="me-2" />Active Listings ({activeFoods.length})</span>}>
              {activeFoods.length === 0 ? (
                <div className="text-center py-4">
                  <p>You don't have any active food listings.</p>
                  <Link to="/giver/food/add">
                    <Button variant="primary">Share Food Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="food-listings">
                  {activeFoods.map((food) => (
                    <Card key={food._id} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={2}>
                            {food.images && food.images.length > 0 ? (
                              <img 
                                src={`/uploads/${food.images[0]}`} 
                                alt={food.title}
                                className="img-fluid rounded"
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div 
                                className="no-image bg-light rounded d-flex justify-content-center align-items-center"
                                style={{ height: '100px' }}
                              >
                                <small className="text-muted">No image</small>
                              </div>
                            )}
                          </Col>
                          <Col md={7}>
                            <h5 className="mb-1">{food.title}</h5>
                            <Badge 
                              bg={food.foodType === 'Vegetarian' ? 'success' : food.foodType === 'Non-Vegetarian' ? 'danger' : 'info'} 
                              className="mb-2"
                            >
                              {food.foodType}
                            </Badge>
                            <p className="mb-1">Quantity: {food.quantity}</p>
                            <p className="mb-0 small text-muted">
                              Added on {new Date(food.createdAt).toLocaleDateString()}
                            </p>
                          </Col>
                          <Col md={3} className="d-flex flex-column justify-content-center">
                            <Link to={`/food/${food._id}`} className="mb-2">
                              <Button variant="outline-primary" size="sm" className="w-100">
                                View Details
                              </Button>
                            </Link>
                            <Link to={`/giver/food/edit/${food._id}`} className="mb-2">
                              <Button variant="outline-secondary" size="sm" className="w-100">
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="w-100"
                              onClick={() => handleMarkUnavailable(food._id)}
                            >
                              Mark Unavailable
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="past" title={<span><FaHistory className="me-2" />Past Listings ({pastFoods.length})</span>}>
              {pastFoods.length === 0 ? (
                <div className="text-center py-4">
                  <p>You don't have any past food listings.</p>
                </div>
              ) : (
                <div className="food-listings">
                  {pastFoods.map((food) => (
                    <Card key={food._id} className="mb-3 bg-light">
                      <Card.Body>
                        <Row>
                          <Col md={2}>
                            {food.images && food.images.length > 0 ? (
                              <img 
                                src={`/uploads/${food.images[0]}`} 
                                alt={food.title}
                                className="img-fluid rounded"
                                style={{ width: '100%', height: '100px', objectFit: 'cover', opacity: '0.7' }}
                              />
                            ) : (
                              <div 
                                className="no-image bg-light rounded d-flex justify-content-center align-items-center"
                                style={{ height: '100px' }}
                              >
                                <small className="text-muted">No image</small>
                              </div>
                            )}
                          </Col>
                          <Col md={7}>
                            <h5 className="mb-1 text-muted">{food.title}</h5>
                            <Badge 
                              bg={food.foodType === 'Vegetarian' ? 'success' : food.foodType === 'Non-Vegetarian' ? 'danger' : 'info'} 
                              className="mb-2"
                            >
                              {food.foodType}
                            </Badge>
                            <p className="mb-1">Quantity: {food.quantity}</p>
                            <p className="mb-0 small text-muted">
                              Added on {new Date(food.createdAt).toLocaleDateString()}
                            </p>
                          </Col>
                          <Col md={3} className="d-flex flex-column justify-content-center">
                            <Link to={`/food/${food._id}`}>
                              <Button variant="outline-secondary" size="sm" className="w-100">
                                View Details
                              </Button>
                            </Link>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="ratings" title={<span><FaStar className="me-2" />My Ratings ({ratings.length})</span>}>
              {ratings.length === 0 ? (
                <div className="text-center py-4">
                  <p>You haven't received any ratings yet.</p>
                  <p className="text-muted">Share food to start receiving ratings!</p>
                </div>
              ) : (
                <div className="ratings-list">
                  {ratings.map((rating) => (
                    <Card key={rating._id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">
                              {rating.taker.name} 
                              <span className="text-muted ms-2 small">
                                {new Date(rating.createdAt).toLocaleDateString()}
                              </span>
                            </h5>
                            <div className="mb-2">
                              <RatingStars rating={rating.rating} />
                            </div>
                            {rating.review && <p className="mb-0">{rating.review}</p>}
                          </div>
                          <div>
                            <Badge bg="info">
                              {rating.food.title}
                            </Badge>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GiverDashboard;