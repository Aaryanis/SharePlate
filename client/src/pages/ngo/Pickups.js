import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkedAlt, FaUtensils, FaFilter, FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import api from '../../utils/api';
import { formatRelativeTime, formatDateTime, formatFoodType } from '../../utils/formatters';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import anime from 'animejs';

const Pickups = () => {
  const { user } = useContext(AuthContext);
  const { notifyDonationConfirmed } = useContext(SocketContext);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    foodType: '',
    distance: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Claim modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [pickupTime, setPickupTime] = useState(new Date(Date.now() + 60 * 60 * 1000)); // Default: 1 hour from now
  const [notes, setNotes] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  
  useEffect(() => {
    anime({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.search-bar, .filter-bar',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);
  
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        
        // Get user's location for proximity search
        const userLocation = user?.location?.coordinates;
        
        const res = await api.get('/api/food', {
          params: {
            lat: userLocation ? userLocation[1] : undefined,
            lng: userLocation ? userLocation[0] : undefined,
            distance: filters.distance
          }
        });
        
        setFoods(res.data.data || []);
        setFilteredFoods(res.data.data || []);
      } catch (err) {
        console.error('Error fetching foods:', err);
        setError('Failed to load available food. Please try again.');
      } finally {
        setLoading(false);
        
        // Animate food cards
        setTimeout(() => {
          anime({
            targets: '.food-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            easing: 'easeOutQuad',
            duration: 800
          });
        }, 300);
      }
    };
    
    if (user?.id) {
      fetchFoods();
    }
  }, [user, filters.distance]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...foods];
    
    // Apply food type filter
    if (filters.foodType) {
      result = result.filter(food => food.foodType === filters.foodType);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(food => 
        food.title.toLowerCase().includes(term) || 
        food.description.toLowerCase().includes(term) ||
        (food.donorName && food.donorName.toLowerCase().includes(term))
      );
    }
    
    setFilteredFoods(result);
  }, [foods, filters.foodType, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      foodType: '',
      distance: 10
    });
    setSearchTerm('');
  };
  
  const openClaimModal = (food) => {
    setSelectedFood(food);
    setShowClaimModal(true);
  };
  
  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedFood(null);
    setPickupTime(new Date(Date.now() + 60 * 60 * 1000));
    setNotes('');
  };
  
  const handleClaimFood = async () => {
    if (!selectedFood) return;
    
    setClaimLoading(true);
    
    try {
      const res = await api.post('/api/donations', {
        foodId: selectedFood._id,
        pickupTime: pickupTime.toISOString(),
        notes
      });
      
      if (res.data.success) {
        // Notify donor via socket
        notifyDonationConfirmed({
          ...res.data.data,
          donorId: selectedFood.donor
        });
        
        // Remove claimed food from the list
        setFoods(prev => prev.filter(food => food._id !== selectedFood._id));
        
        // Close modal
        closeClaimModal();
        
        // Show success message
        alert('Food claimed successfully! The donor has been notified.');
      }
    } catch (err) {
      console.error('Error claiming food:', err);
      alert('Failed to claim food. Please try again.');
    } finally {
      setClaimLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading available food...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <div className="mb-4">
        <h1 className="page-title fw-bold">
          <FaMapMarkedAlt className="text-success me-2" />
          Available Food Pickups
        </h1>
        <p className="lead text-muted">Browse and claim food donations in your area</p>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup className="search-bar">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search for food..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="mt-3 mt-md-0">
          <div className="d-flex gap-2 filter-bar">
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {showFilters && (
              <Button 
                variant="outline-danger" 
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </Col>
      </Row>
      
      {showFilters && (
        <Card className="mb-4 filter-card border-0 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
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
                    <option value="Mixed">Mixed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Distance (km): {filters.distance}</Form.Label>
                  <Form.Range
                    name="distance"
                    min={1}
                    max={50}
                    value={filters.distance}
                    onChange={handleFilterChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small>1km</small>
                    <small>25km</small>
                    <small>50km</small>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5>{filteredFoods.length} Food Donations Available</h5>
      </div>
      
      {filteredFoods.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-5 text-center">
            <FaUtensils className="text-muted mb-3" size={40} />
            <h5>No Food Donations Available</h5>
            <p className="text-muted mb-3">
              {searchTerm || filters.foodType 
                ? "No food donations match your search criteria. Try adjusting your filters."
                : "There are no food donations available in your area at the moment."}
            </p>
            {(searchTerm || filters.foodType) && (
              <Button 
                variant="outline-secondary"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredFoods.map((food, index) => (
            <Col lg={6} className="mb-4" key={food._id}>
              <Card className="food-card h-100 border-0 shadow-sm">
                <Row className="g-0">
                  <Col md={5}>
                    <div style={{ height: '100%', minHeight: '200px', overflow: 'hidden' }}>
                      {food.images && food.images.length > 0 ? (
                        <img 
                          src={`/uploads/${food.images[0]}`} 
                          alt={food.title} 
                          className="img-fluid h-100 w-100 object-fit-cover"
                          style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}
                        />
                      ) : (
                        <div 
                          className="bg-light d-flex justify-content-center align-items-center h-100"
                          style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}
                        >
                          <FaUtensils size={40} className="text-secondary" />
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={7}>
                    <Card.Body className="d-flex flex-column h-100">
                      <div className="mb-2">
                        <Badge bg={formatFoodType(food.foodType).color} className="me-2">
                          {food.foodType}
                        </Badge>
                        <small className="text-muted">
                          {formatRelativeTime(food.createdAt)}
                        </small>
                      </div>
                      
                      <h5 className="card-title">{food.title}</h5>
                      <p className="card-text text-muted small mb-2">
                        {food.description.substring(0, 100)}{food.description.length > 100 ? '...' : ''}
                      </p>
                      
                      <div className="food-meta mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaUser className="text-success me-2" size={12} />
                          <small>
                            From: {food.donorName || 'Anonymous Donor'}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <FaUtensils className="text-success me-2" size={12} />
                          <small>
                            Quantity: {food.quantity}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaClock className="text-success me-2" size={12} />
                          <small>
                            Fresh until: {formatDateTime(food.freshUntil)}
                          </small>
                        </div>
                      </div>
                      
                      <div className="mt-auto d-flex gap-2">
                        <Link to={`/food/${food._id}`} className="w-50">
                          <Button variant="outline-success" size="sm" className="w-100">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="w-50"
                          onClick={() => openClaimModal(food)}
                        >
                          Claim Food
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Claim Food Modal */}
      <Modal show={showClaimModal} onHide={closeClaimModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Claim Food Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFood && (
            <>
              <h5>{selectedFood.title}</h5>
              <p className="text-muted">{selectedFood.description}</p>
              
              <div className="mb-3">
                <Badge bg={formatFoodType(selectedFood.foodType).color}>
                  {selectedFood.foodType}
                </Badge>
                <span className="ms-2">Quantity: {selectedFood.quantity}</span>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    When will you pick up this food?
                  </Form.Label>
                  <DatePicker
                    selected={pickupTime}
                    onChange={(date) => setPickupTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    minDate={new Date()}
                    maxDate={new Date(selectedFood.freshUntil)}
                  />
                  <Form.Text className="text-muted">
                    Please select a time before the food expires ({formatDateTime(selectedFood.freshUntil)})
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific instructions or notes for the donor?"
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeClaimModal}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleClaimFood}
            disabled={claimLoading}
          >
            {claimLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Claim'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pickups;