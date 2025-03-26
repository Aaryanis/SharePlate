import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaBoxOpen, FaCalendarAlt, FaBuilding, FaClock, FaCheck, FaUserAlt } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDateTime, formatRelativeTime, formatDonationStatus } from '../../utils/formatters';
import anime from 'animejs';

const Donations = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        const res = await api.get('/api/donations/donor');
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
          My Donations
        </h1>
        <p className="lead text-muted">Track status of all your food donations</p>
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
              eventKey="all" 
              title={<span className="fw-semi-bold">All Donations ({donations.length})</span>}
            />
            <Tab 
              eventKey="scheduled" 
              title={
                <span>
                  Scheduled ({donations.filter(d => d.status === 'scheduled').length})
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
              eventKey="cancelled" 
              title={
                <span>
                  Cancelled ({donations.filter(d => d.status === 'cancelled').length})
                </span>
              }
            />
          </Tabs>
          
          {filteredDonations.length === 0 ? (
            <div className="text-center py-5">
              <p>No donations found in this category.</p>
              <Button 
                variant="success" 
                href="/donor/food/add"
              >
                Share Food Now
              </Button>
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
                            alt={donation.foodDetails.title} 
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
                        <div className="d-flex align-items-center mb-2">
                          <FaBuilding className="text-success me-2" />
                          <span>Claimed by: <strong>{donation.ngoName}</strong></span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-success me-2" />
                          <span>Pickup Time: <strong>{formatDateTime(donation.pickupTime)}</strong></span>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <FaClock className="text-success me-2" />
                          <span>Donation created {formatRelativeTime(donation.createdAt)}</span>
                        </div>
                      </div>
                      
                      {donation.notes && (
                        <div className="mb-3">
                          <p className="mb-1"><strong>Notes from NGO:</strong></p>
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
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => {
                              // Cancel donation
                              alert('This would cancel the donation');
                            }}
                          >
                            Cancel Donation
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
    </Container>
  );
};

export default Donations;