import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { FaUser, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaUtensils, FaRegClock, FaCheck } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import api from '../utils/api';
import { formatDateTime, formatRelativeTime, formatFoodType } from '../utils/formatters';
import anime from 'animejs';

const libraries = ['places'];

const FoodDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { notifyDonationConfirmed } = useContext(SocketContext);
  const navigate = useNavigate();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });
  
  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const res = await api.get(`/api/food/${id}`);
        setFood(res.data.data);
        
        // Animation for page elements
        anime({
          targets: '.detail-section',
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(150),
          easing: 'easeOutQuad',
          duration: 800
        });
      } catch (error) {
        console.error('Error fetching food details:', error);
        setError('Failed to load food details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodDetails();
  }, [id]);
  
  const handleClaimFood = () => {
    setShowModal(true);
  };
  
  const handleModalClose = () => {
    setShowModal(false);
  };
  
  const handlePickupTimeChange = (e) => {
    setPickupTime(e.target.value);
  };
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };
  
  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    
    if (!pickupTime) {
      alert('Please select a pickup time');
      return;
    }
    
    setDonationLoading(true);
    
    try {
      const res = await api.post('/api/donations', {
        foodId: id,
        pickupTime,
        notes
      });
      
      if (res.data.success) {
        // Notify donor via socket
        notifyDonationConfirmed({
          ...res.data.data,
          donorId: food.donor
        });
        
        setSuccessMessage('Food claimed successfully! The donor has been notified.');
        setShowModal(false);
        
        // Refresh food data
        setFood({
          ...food,
          isAvailable: false
        });
        
        // Animation for success message
        setTimeout(() => {
          anime({
            targets: '.success-alert',
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutQuad',
            duration: 800
          });
        }, 300);
      }
    } catch (error) {
      console.error('Error claiming food:', error);
      setError('Failed to claim food. Please try again.');
    } finally {
      setDonationLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading food details...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Alert variant="danger">
          {error}
          <div className="text-center mt-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!food) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Alert variant="warning">
          Food item not found.
          <div className="text-center mt-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  const foodTypeData = formatFoodType(food.foodType);
  
  return (
    <Container className="py-5 mt-5">
      {successMessage && (
        <Alert variant="success" className="mb-4 success-alert" style={{ opacity: 0 }}>
          <FaCheck className="me-2" />
          {successMessage}
        </Alert>
      )}
      
      <Row>
        <Col lg={7} className="mb-4 mb-lg-0">
          <div className="detail-section">
            <div className="food-image-gallery mb-4">
              {food.images && food.images.length > 0 ? (
                <>
                  <div className="main-image-container" style={{ height: '400px', overflow: 'hidden', borderRadius: '10px' }}>
                    <img 
                      src={`/uploads/${food.images[activeImage]}`} 
                      alt={food.title} 
                      className="img-fluid w-100 h-100 object-fit-cover"
                    />
                  </div>
                  
                  {food.images.length > 1 && (
                    <Row className="mt-3">
                      {food.images.map((image, index) => (
                        <Col key={index} xs={3} className="mb-3">
                          <div 
                            className={`thumbnail-container ${index === activeImage ? 'active-thumbnail' : ''}`}
                            style={{ 
                              height: '80px', 
                              overflow: 'hidden', 
                              borderRadius: '5px',
                              cursor: 'pointer',
                              border: index === activeImage ? '2px solid #28a745' : '1px solid #dee2e6'
                            }}
                            onClick={() => setActiveImage(index)}
                          >
                            <img 
                              src={`/uploads/${image}`} 
                              alt={`${food.title} thumbnail ${index + 1}`} 
                              className="img-fluid w-100 h-100 object-fit-cover"
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              ) : (
                <div className="main-image-container bg-light d-flex justify-content-center align-items-center" 
                  style={{ height: '400px', borderRadius: '10px' }}
                >
                  <FaUtensils size={60} className="text-secondary" />
                </div>
              )}
            </div>
          </div>
        </Col>
        
        <Col lg={5}>
          <Card className="border-0 shadow-sm detail-section">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="fw-bold mb-0">{food.title}</h2>
                <Badge bg={foodTypeData.color} className="px-3 py-2">
                  {foodTypeData.text}
                </Badge>
              </div>
              
              <p className="mb-4">{food.description}</p>
              
              <div className="food-meta mb-4">
                <div className="d-flex align-items-center mb-2">
                  <FaUser className="text-success me-2" />
                  <span>Donor: {food.donorName || 'Anonymous Donor'}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <FaUtensils className="text-success me-2" />
                  <span>Quantity: {food.quantity}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <FaRegClock className="text-success me-2" />
                  <span>Fresh Until: {formatDateTime(food.freshUntil)}</span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <FaClock className="text-success me-2" />
                  <span>Posted: {formatRelativeTime(food.createdAt)}</span>
                </div>
                
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="text-success me-2" />
                  <span>Location: {food.location.address}</span>
                </div>
              </div>
              
              {food.pickupInstructions && (
                <div className="pickup-instructions mb-4">
                  <h5>Pickup Instructions</h5>
                  <p className="mb-0">{food.pickupInstructions}</p>
                </div>
              )}
              
              <div className="d-grid">
                {isAuthenticated && user?.userType === 'ngo' && food.isAvailable ? (
                  <Button 
                    variant="success" 
                    size="lg" 
                    onClick={handleClaimFood}
                  >
                    Claim This Food
                  </Button>
                ) : food.isAvailable ? (
                  <Alert variant="info" className="mb-0">
                    <p className="mb-2">This food is available for pickup by registered NGOs.</p>
                    {!isAuthenticated ? (
                      <Button 
                        variant="outline-success" 
                        onClick={() => navigate('/login')}
                      >
                        Login as NGO to claim
                      </Button>
                    ) : null}
                  </Alert>
                ) : (
                  <Alert variant="warning" className="mb-0">
                    This food has already been claimed and is no longer available.
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm mt-4 detail-section">
            <Card.Body className="p-4">
              <h5 className="mb-3">Location</h5>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '10px'
                  }}
                  center={{
                    lat: food.location.coordinates[1],
                    lng: food.location.coordinates[0]
                  }}
                  zoom={14}
                >
                  <Marker
                    position={{
                      lat: food.location.coordinates[1],
                      lng: food.location.coordinates[0]
                    }}
                    icon={{
                      url: '/img/food-marker.png',
                      scaledSize: new window.google.maps.Size(40, 40),
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(20, 20)
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '200px', borderRadius: '10px' }}>
                  <Spinner animation="border" variant="success" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Claim Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Claim Food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are claiming: <strong>{food.title}</strong></p>
          <Form onSubmit={handleSubmitClaim}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCalendarAlt className="me-2" />
                When will you pick up the food?
              </Form.Label>
              <Form.Control
                type="datetime-local"
                value={pickupTime}
                onChange={handlePickupTimeChange}
                required
              />
              <Form.Text className="text-muted">
                Select a time that works for both you and the donor.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Any specific instructions or questions for the donor?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitClaim}
            disabled={donationLoading || !pickupTime}
          >
            {donationLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Pickup'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FoodDetail;