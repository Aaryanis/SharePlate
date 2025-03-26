import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FaFilter, FaMapMarkerAlt, FaUtensils, FaClock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatRelativeTime, formatFoodType } from '../utils/formatters';
import anime from 'animejs';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: '10px',
  overflow: 'hidden'
};

const FoodMap = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [center, setCenter] = useState({
    lat: 20.5937, // Default to India center
    lng: 78.9629
  });
  const [filters, setFilters] = useState({
    foodType: '',
    distance: 10
  });
  const [userLocation, setUserLocation] = useState(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });
  
  useEffect(() => {
    anime({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.filter-card',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 200
    });
  }, []);
  
  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({
            lat: latitude,
            lng: longitude
          });
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          
          // Fetch food listings with the user's location
          fetchFoodListings(latitude, longitude, filters.distance);
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchFoodListings(center.lat, center.lng, filters.distance);
        }
      );
    } else {
      fetchFoodListings(center.lat, center.lng, filters.distance);
    }
  }, []);
  
  const fetchFoodListings = async (lat, lng, distance) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await api.get(`/api/food?lat=${lat}&lng=${lng}&distance=${distance}`);
      setFoods(res.data.data);
      
      // Animate food items appearing on load
      setTimeout(() => {
        anime({
          targets: '.food-list-item',
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(100),
          easing: 'easeOutQuad',
          duration: 800
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching food listings:', error);
      setError('Failed to load food listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const applyFilters = () => {
    if (userLocation) {
      fetchFoodListings(userLocation.lat, userLocation.lng, filters.distance);
    } else {
      fetchFoodListings(center.lat, center.lng, filters.distance);
    }
  };
  
  const onMapClick = useCallback(() => {
    setSelectedFood(null);
  }, []);
  
  if (loadError) return <div className="text-center p-5">Error loading maps</div>;
  if (!isLoaded) return <div className="text-center p-5"><Spinner animation="border" variant="success" /></div>;
  
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col className="mb-4">
          <h1 className="page-title fw-bold">
            <FaMapMarkerAlt className="text-success me-2" />
            Available Food Map
          </h1>
          <p className="lead text-muted">Find food donations available near you</p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="filter-card shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <FaFilter className="text-success me-2" />
                    <h5 className="mb-0">Filters</h5>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Food Type</Form.Label>
                    <Form.Select 
                      name="foodType"
                      value={filters.foodType}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Types</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Distance (km)</Form.Label>
                    <Form.Range
                      name="distance"
                      min={1}
                      max={50}
                      value={filters.distance}
                      onChange={handleFilterChange}
                    />
                    <div className="d-flex justify-content-between">
                      <small>1km</small>
                      <small>{filters.distance}km</small>
                      <small>50km</small>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={applyFilters}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            onClick={onMapClick}
            options={{
              fullscreenControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true
            }}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: '/img/user-marker.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15)
                }}
              />
            )}
            
            {/* Food markers */}
            {foods.map(food => (
              <Marker
                key={food._id}
                position={{
                  lat: food.location.coordinates[1],
                  lng: food.location.coordinates[0]
                }}
                onClick={() => setSelectedFood(food)}
                icon={{
                  url: '/img/food-marker.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(20, 20)
                }}
              />
            ))}
            
            {/* Info window for selected food */}
            {selectedFood && (
              <InfoWindow
                position={{
                  lat: selectedFood.location.coordinates[1],
                  lng: selectedFood.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedFood(null)}
              >
                <div className="p-2" style={{ maxWidth: '250px' }}>
                  <h5>{selectedFood.title}</h5>
                  <Badge bg={formatFoodType(selectedFood.foodType).color} className="mb-2">
                    {selectedFood.foodType}
                  </Badge>
                  <p className="mb-1">{selectedFood.description.substring(0, 100)}...</p>
                  <p className="mb-1">
                    <FaUser className="me-1" /> 
                    {selectedFood.donorName || 'Anonymous Donor'}
                  </p>
                  <p className="mb-2">
                    <FaClock className="me-1" /> 
                    {formatRelativeTime(selectedFood.createdAt)}
                  </p>
                  <Link to={`/food/${selectedFood._id}`}>
                    <Button variant="success" size="sm">View Details</Button>
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </Col>
        
        <Col lg={4}>
          <div className="food-list-container bg-light p-3 rounded" style={{ height: '70vh', overflowY: 'auto' }}>
            <h5 className="mb-3">Available Food ({foods.length})</h5>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2">Loading food listings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <p className="text-danger">{error}</p>
                <Button variant="outline-success" onClick={() => applyFilters()}>
                  Try Again
                </Button>
              </div>
            ) : foods.length === 0 ? (
              <div className="text-center py-5">
                <p>No food listings available in this area.</p>
                <p className="text-muted">Try increasing the distance or changing filters.</p>
              </div>
            ) : (
              foods.map((food, index) => (
                <Card 
                  key={food._id} 
                  className="food-list-item mb-3 border-0 shadow-sm"
                  onClick={() => setSelectedFood(food)}
                  style={{ cursor: 'pointer', opacity: 0 }}
                >
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={4}>
                        <div style={{ height: '70px', width: '100%', overflow: 'hidden', borderRadius: '5px' }}>
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
                      <Col xs={8}>
                        <h6 className="mb-1 text-truncate">{food.title}</h6>
                        <Badge bg={formatFoodType(food.foodType).color} className="mb-1">
                          {food.foodType}
                        </Badge>
                        <p className="text-muted small mb-0">
                          <FaClock className="me-1" />
                          {formatRelativeTime(food.createdAt)}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodMap;