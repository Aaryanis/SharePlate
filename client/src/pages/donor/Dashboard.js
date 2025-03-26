import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUtensils, FaPlus, FaStar, FaHistory, FaBoxOpen, FaUserAlt, FaMedal, FaListAlt } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import { formatFoodType, formatRelativeTime, formatDonationStatus } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import anime from 'animejs';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('active');
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalClaimed: 0,
    availableDonations: 0,
    credits: 0
  });
  const [activeFoods, setActiveFoods] = useState([]);
  const [pastDonations, setPastDonations] = useState([]);
  const [recentRatings, setRecentRatings] = useState([]);
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
    
    anime({
      targets: '.dashboard-tabs',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 500
    });
  }, []);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch active food listings
        const foodRes = await api.get('/api/food?donor=' + user?.id);
        
        const active = foodRes.data.data.filter(food => food.isAvailable);
        setActiveFoods(active);
        
        // Fetch donations
        const donationsRes = await api.get('/api/donations/donor');
        setPastDonations(donationsRes.data.data || []);
        
        // Calculate stats
        setStats({
          totalDonations: foodRes.data.data.length,
          totalClaimed: donationsRes.data.data.length,
          availableDonations: active.length,
          credits: user?.credits || 0
        });
        
        // Fetch ratings (if any)
        try {
          const ratingsRes = await api.get(`/api/ratings/donor/${user?.id}`);
          setRecentRatings(ratingsRes.data.data || []);
        } catch (ratingErr) {
          console.log('No ratings found');
          setRecentRatings([]);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
        
        // Animate content after loading
        anime({
          targets: '.food-item, .donation-item, .rating-item',
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
              <FaUserAlt className="text-success me-2" />
              Welcome, {user?.name}
            </h1>
            <p className="lead text-muted">Manage your food donations and track your impact</p>
          </Col>
          <Col xs="auto">
            <Link to="/donor/food/add">
              <Button variant="success" className="d-flex align-items-center">
                <FaPlus className="me-2" /> Add New Donation
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaBoxOpen />}
            count={stats.totalDonations}
            label="Total Donations"
            color="primary"
            iconBg="light"
          />
        </Col>
        
        <Col md={3} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaUtensils />}
            count={stats.availableDonations}
            label="Available Donations"
            color="success"
            iconBg="light"
          />
        </Col>
        
        <Col md={3} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaHistory />}
            count={stats.totalClaimed}
            label="Claimed Donations"
            color="info"
            iconBg="light"
          />
        </Col>
        
        <Col md={3} sm={6} className="mb-4 mb-md-0">
          <StatCard
            icon={<FaMedal />}
            count={stats.credits}
            label="Credits Earned"
            color="warning"
            iconBg="light"
          />
        </Col>
      </Row>
      
      <Card className="dashboard-tabs border-0 shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab 
              eventKey="active" 
              title={
                <span><FaUtensils className="me-2" />Active Donations ({activeFoods.length})</span>
              }
            >
              {activeFoods.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mb-3">You don't have any active food donations.</p>
                  <Link to="/donor/food/add">
                    <Button variant="success">
                      <FaPlus className="me-2" /> Donate Food Now
                    </Button>
                  </Link>
                </div>
              ) : (
                activeFoods.map((food, index) => (
                  <Card key={food._id} className="food-item mb-3 border-0 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={2} className="mb-3 mb-md-0">
                          <div className="food-image" style={{ height: '100px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                            {food.images && food.images.length > 0 ? (
                              <img 
                                src={`/uploads/${food.images[0]}`} 
                                alt={food.title} 
                                className="img-fluid h-100 w-100 object-fit-cover"
                              />
                            ) : (
                              <div className="bg-light d-flex justify-content-center align-items-center h-100">
                                <FaUtensils size={30} className="text-secondary" />
                              </div>
                            )}
                          </div>
                        </Col>
                        
                        <Col md={6} className="mb-3 mb-md-0">
                          <h5>{food.title}</h5>
                          <div className="mb-2">
                            <Badge bg={formatFoodType(food.foodType).color} className="me-2">
                              {food.foodType}
                            </Badge>
                            <small className="text-muted">
                              Posted {formatRelativeTime(food.createdAt)}
                            </small>
                          </div>
                          <p className="mb-0 text-truncate">{food.description}</p>
                        </Col>
                        
                        <Col md={4} className="text-md-end">
                          <div className="d-flex gap-2 justify-content-md-end">
                            <Link to={`/food/${food._id}`}>
                              <Button variant="outline-primary" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link to={`/donor/food/edit/${food._id}`}>
                              <Button variant="outline-secondary" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                // Mark as unavailable functionality
                                alert('This would mark the food as unavailable');
                              }}
                            >
                              Mark Unavailable
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Tab>
            
            <Tab 
              eventKey="history" 
              title={
                <span><FaHistory className="me-2" />Donation History ({pastDonations.length})</span>
              }
            >
              {pastDonations.length === 0 ? (
                <div className="text-center py-5">
                  <p>You don't have any past donations yet.</p>
                </div>
              ) : (
                pastDonations.map((donation, index) => (
                  <Card key={donation._id} className="donation-item mb-3 border-0 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={8} className="mb-3 mb-md-0">
                          <h5>{donation.foodDetails?.title || 'Food Donation'}</h5>
                          <p className="mb-2">
                            <Badge bg={formatDonationStatus(donation.status).color}>
                              {formatDonationStatus(donation.status).text}
                            </Badge>
                            <span className="ms-2 text-muted">
                              Claimed by {donation.ngoName}
                            </span>
                          </p>
                          <p className="mb-0 small text-muted">
                            Pickup time: {new Date(donation.pickupTime).toLocaleString()}
                          </p>
                        </Col>
                        
                        <Col md={4} className="text-md-end">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              // View donation details
                              alert('This would show donation details');
                            }}
                          >
                            View Details
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Tab>
            
            <Tab 
              eventKey="ratings" 
              title={
                <span><FaStar className="me-2" />My Ratings ({recentRatings.length})</span>
              }
            >
              {recentRatings.length === 0 ? (
                <div className="text-center py-5">
                  <p>You haven't received any ratings yet.</p>
                  <p className="text-muted">Ratings will appear here once NGOs rate your donations.</p>
                </div>
              ) : (
                recentRatings.map((rating, index) => (
                  <Card key={rating._id} className="rating-item mb-3 border-0 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={1} className="mb-3 mb-md-0 text-center">
                          <div className="rating-value fw-bold fs-4 text-warning">
                            {rating.rating}
                          </div>
                          <div className="text-muted small">out of 5</div>
                        </Col>
                        
                        <Col md={8} className="mb-3 mb-md-0">
                          <h5 className="mb-1">Rating from {rating.ngo?.name || 'NGO'}</h5>
                          <p className="mb-1 text-muted small">
                            For donation: {rating.donation?.foodDetails?.title || 'Food Donation'}
                          </p>
                          {rating.review && (
                            <p className="mb-0">
                              <i>"{rating.review}"</i>
                            </p>
                          )}
                        </Col>
                        
                        <Col md={3} className="text-md-end">
                          <small className="text-muted">
                            {formatRelativeTime(rating.createdAt)}
                          </small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;