import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaHistory, FaCommentAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import RatingStars from '../components/common/RatingStars';

const TakerDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('nearby');
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [givenRatings, setGivenRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get user location to find nearby food
      let lat = 20.5937; // Default lat
      let lng = 78.9629; // Default lng
      
      if (user && user.location && user.location.coordinates) {
        lng = user.location.coordinates[0];
        lat = user.location.coordinates[1];
      }
      
      // Fetch nearby food
      const nearbyRes = await api.get(`/api/food?lat=${lat}&lng=${lng}&distance=10`);
      setNearbyFoods(nearbyRes.data.data);
      
      // For demo purposes, just showing some dummy favorites
      // In a real app, you'd have a favorites system
      setFavoriteFoods(nearbyRes.data.data.slice(0, 2));
      
      // Fetch ratings given by the user
      // This would be a real endpoint in the final app
      // For now just showing mock data
      setGivenRatings([
        {
          _id: '1',
          giver: { name: 'Rahul Sharma' },
          food: { title: 'Homemade Rajma Chawal' },
          rating: 5,
          review: 'Delicious food! Very fresh and tasty.',
          createdAt: new Date()
        },
        {
          _id: '2',
          giver: { name: 'Priya Patel' },
          food: { title: 'Extra Dal Makhani' },
          rating: 4,
          review: 'Good food, nicely packed.',
          createdAt: new Date(Date.now() - 86400000) // Yesterday
        }
      ]);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
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
      <h1 className="mb-4">Taker Dashboard</h1>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h3>{nearbyFoods.length}</h3>
              <p className="text-muted mb-0">Food Items Available Nearby</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <h3>{givenRatings.length}</h3>
              <p className="text-muted mb-0">Ratings Given</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Link to="/food-map">
            <Button variant="primary">
              <FaMapMarkerAlt className="me-2" /> Find Food Near Me
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
            <Tab eventKey="nearby" title={<span><FaMapMarkerAlt className="me-2" />Nearby Food ({nearbyFoods.length})</span>}>
              {nearbyFoods.length === 0 ? (
                <div className="text-center py-4">
                  <p>There's no food available near you right now.</p>
                  <p className="text-muted">Check back later or increase your search radius on the map.</p>
                  <Link to="/food-map">
                    <Button variant="primary">Go to Food Map</Button>
                  </Link>
                </div>
              ) : (
                <div className="food-listings">
                  {nearbyFoods.map((food) => (
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
                            <p className="mb-1 small">
                              <FaMapMarkerAlt className="me-1" />
                              {food.location.address}
                            </p>
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
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="w-100 mb-2"
                              onClick={() => {
                                // In a real app, add to favorites functionality
                                alert('Added to favorites!');
                              }}
                            >
                              <FaHeart className="me-1" /> Favorite
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="favorites" title={<span><FaHeart className="me-2" />My Favorites ({favoriteFoods.length})</span>}>
              {favoriteFoods.length === 0 ? (
                <div className="text-center py-4">
                  <p>You don't have any favorite food items.</p>
                  <p className="text-muted">Browse food listings and add to your favorites!</p>
                  <Link to="/food-map">
                    <Button variant="primary">Find Food</Button>
                  </Link>
                </div>
              ) : (
                <div className="food-listings">
                  {favoriteFoods.map((food) => (
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
                            <p className="mb-1 small">
                              <FaMapMarkerAlt className="me-1" />
                              {food.location.address}
                            </p>
                          </Col>
                          <Col md={3} className="d-flex flex-column justify-content-center">
                            <Link to={`/food/${food._id}`} className="mb-2">
                              <Button variant="outline-primary" size="sm" className="w-100">
                                View Details
                              </Button>
                            </Link>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="w-100"
                              onClick={() => {
                                // In a real app, remove from favorites functionality
                                alert('Removed from favorites!');
                              }}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>
            
            <Tab eventKey="ratings" title={<span><FaCommentAlt className="me-2" />My Ratings ({givenRatings.length})</span>}>
              {givenRatings.length === 0 ? (
                <div className="text-center py-4">
                  <p>You haven't given any ratings yet.</p>
                  <p className="text-muted">Receive food and rate the givers!</p>
                </div>
              ) : (
                <div className="ratings-list">
                  {givenRatings.map((rating) => (
                    <Card key={rating._id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">
                              {rating.giver.name} 
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

export default TakerDashboard;