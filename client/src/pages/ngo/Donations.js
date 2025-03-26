import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { FaBoxOpen, FaCalendarAlt, FaUser, FaClock, FaCheck, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import api from '../../utils/api';
import { formatDateTime, formatRelativeTime, formatDonationStatus, formatFoodType } from '../../utils/formatters';
import RatingStars from '../../components/common/RatingStars';
import anime from 'animejs';

const Donations = () => {
  const { user } = useContext(AuthContext);
  const { notifyDonationCompleted } = useContext(SocketContext);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Complete donation modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  
  // Rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  
  useEffect(() => {
    anime({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.donations-tabs',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 300
    });
  }, []);
  
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/donations/ngo');
        setDonations(res.data.data || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchDonations();
    }
  }, [user]);
  
  useEffect(() => {
    // Filter donations based on active tab
    if (activeTab === 'all') {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(donations.filter(donation => donation.status === activeTab));
    }
    
    // Animate donation items
    if (!loading && filteredDonations.length > 0) {
      anime({
        targets: '.donation-item',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, [activeTab, donations, loading]);
  
  const openCompleteModal = (donation) => {
    setSelectedDonation(donation);
    setShowCompleteModal(true);
  };
  
  const closeCompleteModal = () => {
    setShowCompleteModal(false);
    setSelectedDonation(null);
  };
  
  const handleCompleteDonation = async () => {
    if (!selectedDonation) return;
    
    setCompleteLoading(true);
    
    try {
      const res = await api.put(`/api/donations/${selectedDonation._id}/complete`);
      
      if (res.data.success) {
        // Notify donor via socket
        notifyDonationCompleted({
          ...res.data.data,
          donorId: selectedDonation.donor
        });
        
        // Update local donations list
        const updatedDonations = donations.map(d => 
          d._id === selectedDonation._id ? { ...d, status: 'completed' } : d
        );
        
        setDonations(updatedDonations);
        
        // Close modal
        closeCompleteModal();
        
        // Open rating modal
        setSelectedDonation({ ...selectedDonation, status: 'completed' });
        setShowRatingModal(true);
      }
    } catch (err) {
      console.error('Error completing donation:', err);
      alert('Failed to mark donation as completed. Please try again.');
    } finally {
      setCompleteLoading(false);
    }
  };
  
  const openRatingModal = (donation) => {
    setSelectedDonation(donation);
    setShowRatingModal(true);
  };
  
  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedDonation(null);
    setRatingValue(5);
    setReviewText('');
  };
  
  const handleSubmitRating = async () => {
    if (!selectedDonation) return;
    
    setRatingLoading(true);
    
    try {
      const res = await api.post('/api/ratings', {
        donationId: selectedDonation._id,
        rating: ratingValue,
        review: reviewText
      });
      
      if (res.data.success) {
        // Close modal
        closeRatingModal();
        
        // Show success message
        alert('Rating submitted successfully!');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading donations...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <div className="mb-4">
        <h1 className="page-title fw-bold">
          <FaBoxOpen className="text-success me-2" />
          Manage Food Pickups
        </h1>
        <p className="lead text-muted">Track and manage all your food pickups</p>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Card className="border-0 shadow-sm donations-tabs">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab 
              eventKey="scheduled" 
              title={
                <span>
                  Pending Pickups ({donations.filter(d => d.status === 'scheduled').length})
                </span>
              }
            />
            <Tab 
              eventKey="completed" 
              title={
                <span>
                  Completed ({donations.filter(d => d.status === 'completed').length})
                </span>
              }
            />
            <Tab 
              eventKey="all" 
              title={
                <span>All Pickups ({donations.length})</span>
              }
            />
          </Tabs>
          
          {filteredDonations.length === 0 ? (
            <div className="text-center py-5">
              <p>No donations found in this category.</p>
              {activeTab === 'scheduled' && (
                <Button 
                  variant="success" 
                  href="/ngo/pickups"
                >
                  Find Food to Pickup
                </Button>
              )}
            </div>
          ) : (
            filteredDonations.map((donation, index) => (
              <Card key={donation._id} className="donation-item mb-3 border-0 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col lg={3} md={4} className="mb-3 mb-md-0">
                      <div style={{ height: '150px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        {donation.foodDetails?.images && donation.foodDetails.images.length > 0 ? (
                          <img 
                            src={`/uploads/${donation.foodDetails.images[0]}`} 
                            alt={donation.foodDetails?.title || 'Food'} 
                            className="img-fluid h-100 w-100 object-fit-cover"
                          />
                        ) : (
                          <div className="bg-light d-flex justify-content-center align-items-center h-100">
                            <FaBoxOpen size={40} className="text-secondary" />
                          </div>
                        )}
                      </div>
                    </Col>
                    
                    <Col lg={9} md={8}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className="mb-1">{donation.foodDetails?.title || 'Food Donation'}</h4>
                        <Badge bg={formatDonationStatus(donation.status).color}>
                          {formatDonationStatus(donation.status).text}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        {donation.foodDetails && (
                          <Badge 
                            bg={formatFoodType(donation.foodDetails.foodType).color} 
                            className="me-2"
                          >
                            {donation.foodDetails.foodType}
                          </Badge>
                        )}
                        <Badge bg="secondary" className="me-2">
                          {donation.foodDetails?.quantity || 'Quantity not specified'}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <FaUser className="text-success me-2" />
                          <span>From: <strong>{donation.foodDetails?.donorName || 'Anonymous Donor'}</strong></span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="text-success me-2" />
                          <span>
                            {donation.foodDetails?.location?.address || 'Location not specified'}
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-success me-2" />
                          <span>Pickup Time: <strong>{formatDateTime(donation.pickupTime)}</strong></span>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <FaClock className="text-success me-2" />
                          <span>Claimed {formatRelativeTime(donation.createdAt)}</span>
                        </div>
                      </div>
                      
                      {donation.notes && (
                        <div className="mb-3">
                          <p className="mb-1"><strong>Your Notes:</strong></p>
                          <p className="mb-0 fst-italic">"{donation.notes}"</p>
                        </div>
                      )}
                      
                      {donation.status === 'completed' && (
                        <div className="completed-badge p-2 bg-light rounded mb-3">
                          <div className="d-flex align-items-center">
                            <FaCheck className="text-success me-2" />
                            <span>
                              Picked up on {formatDateTime(donation.completedAt || donation.updatedAt)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            // View donation details
                            alert('This would show detailed donation info');
                          }}
                        >
                          View Details
                        </Button>
                        
                        {donation.status === 'scheduled' && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => openCompleteModal(donation)}
                          >
                            Mark as Picked Up
                          </Button>
                        )}
                        
                        {donation.status === 'completed' && (
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => openRatingModal(donation)}
                          >
                            <FaStar className="me-1" />
                            Rate Donation
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Card.Body>
      </Card>
      
      {/* Complete Donation Modal */}
      <Modal show={showCompleteModal} onHide={closeCompleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Pickup Completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Have you picked up the following food donation?
          </p>
          {selectedDonation && (
            <Card className="bg-light border-0">
              <Card.Body>
                <h5>{selectedDonation.foodDetails?.title || 'Food Donation'}</h5>
                <p className="mb-1">
                  From: {selectedDonation.foodDetails?.donorName || 'Anonymous Donor'}
                </p>
                <p className="mb-0">
                  Scheduled for: {formatDateTime(selectedDonation.pickupTime)}
                </p>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeCompleteModal}>
            No, Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleCompleteDonation}
            disabled={completeLoading}
          >
            {completeLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Yes, Mark as Picked Up'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={closeRatingModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate this Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <>
              <p className="mb-3">
                How was your experience with this food donation?
              </p>
              
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`mx-1 ${star <= ratingValue ? 'text-warning' : 'text-muted'}`}
                      style={{ cursor: 'pointer', fontSize: '2rem' }}
                      onClick={() => setRatingValue(star)}
                    />
                  ))}
                </div>
                <p className="mb-0">
                  {ratingValue === 5 ? 'Excellent!' : 
                   ratingValue === 4 ? 'Very Good' : 
                   ratingValue === 3 ? 'Good' : 
                   ratingValue === 2 ? 'Fair' : 'Poor'}
                </p>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Review (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this donation..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeRatingModal}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitRating}
            disabled={ratingLoading}
          >
            {ratingLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Donations;