import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUtensils, FaBell, FaCalendarCheck, FaStar, FaCamera, FaMapMarkedAlt, FaTruck, FaThumbsUp, FaUsers, FaMedal, FaHandHoldingHeart } from 'react-icons/fa';
import anime from 'animejs';

const HowItWorks = () => {
  useEffect(() => {
    // Animate page title
    anime({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    // Setup observer for step animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [50, 0],
              easing: 'easeOutQuad',
              duration: 800
            });
            
            // Unobserve after animation
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all step elements
    document.querySelectorAll('.step-card').forEach(step => {
      observer.observe(step);
    });
    
    // Observe all role sections
    document.querySelectorAll('.role-section').forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col className="text-center mb-5">
          <h1 className="page-title fw-bold">How SharePlate Works</h1>
          <p className="lead text-muted">A simple process to connect food donors with NGOs</p>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <div className="process-timeline position-relative">
            <Row className="mb-5">
              <Col md={6} className="mb-4">
                <div className="step-card h-100 p-4 bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-icon me-3 p-3 rounded-circle bg-success text-white">
                      <FaCamera size={24} />
                    </div>
                    <h3 className="mb-0">Step 1: List Your Food</h3>
                  </div>
                  <p className="mb-0">
                    Donors take a photo of the excess food, add details like quantity and type, and share their 
                    location. The entire process takes less than 2 minutes.
                  </p>
                </div>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <img src="/img/step-1.jpg" alt="List Food" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
            </Row>
            
            <Row className="mb-5">
              <Col md={6} className="d-none d-md-flex align-items-center justify-content-center order-md-1">
                <img src="/img/step-2.jpg" alt="NGO Notification" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
              <Col md={6} className="mb-4 order-md-2">
                <div className="step-card h-100 p-4 bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-icon me-3 p-3 rounded-circle bg-success text-white">
                      <FaBell size={24} />
                    </div>
                    <h3 className="mb-0">Step 2: NGOs Get Notified</h3>
                  </div>
                  <p className="mb-0">
                    Nearby NGOs receive instant notifications about the available food. Our smart algorithm 
                    matches food with NGOs based on proximity, capacity, and past performance.
                  </p>
                </div>
              </Col>
              <Col md={6} className="d-flex d-md-none align-items-center justify-content-center order-md-1 mb-4">
                <img src="/img/step-2.jpg" alt="NGO Notification" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
            </Row>
            
            <Row className="mb-5">
              <Col md={6} className="mb-4">
                <div className="step-card h-100 p-4 bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-icon me-3 p-3 rounded-circle bg-success text-white">
                      <FaCalendarCheck size={24} />
                    </div>
                    <h3 className="mb-0">Step 3: Confirm Pickup</h3>
                  </div>
                  <p className="mb-0">
                    NGOs confirm they'll collect the food and specify a pickup time. The donor receives 
                    a notification with the NGO's details and expected arrival time.
                  </p>
                </div>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <img src="/img/step-3.jpg" alt="Confirm Pickup" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
            </Row>
            
            <Row className="mb-5">
              <Col md={6} className="d-none d-md-flex align-items-center justify-content-center order-md-1">
                <img src="/img/step-4.jpg" alt="Food Collection" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
              <Col md={6} className="mb-4 order-md-2">
                <div className="step-card h-100 p-4 bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-icon me-3 p-3 rounded-circle bg-success text-white">
                      <FaTruck size={24} />
                    </div>
                    <h3 className="mb-0">Step 4: Food Is Collected</h3>
                  </div>
                  <p className="mb-0">
                    The NGO arrives at the specified time to collect the food. Both parties can communicate 
                    through our secure chat system if needed.
                  </p>
                </div>
              </Col>
              <Col md={6} className="d-flex d-md-none align-items-center justify-content-center order-md-1 mb-4">
                <img src="/img/step-4.jpg" alt="Food Collection" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-4">
                <div className="step-card h-100 p-4 bg-white shadow-sm rounded">
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-icon me-3 p-3 rounded-circle bg-success text-white">
                      <FaStar size={24} />
                    </div>
                    <h3 className="mb-0">Step 5: Rate & Earn Credits</h3>
                  </div>
                  <p className="mb-0">
                    After successful collection, NGOs provide feedback on the food quality, and donors rate the 
                    NGO's reliability. Donors earn credits that boost their visibility and reputation.
                  </p>
                </div>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <img src="/img/step-5.jpg" alt="Rate and Earn" className="img-fluid rounded shadow-sm" style={{ maxHeight: '250px' }} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-5 role-section">
        <Col>
          <h2 className="text-center mb-4">For Food Donors</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaUtensils size={40} />
                  </div>
                  <h4>Simple Listing Process</h4>
                  <p className="text-muted mb-0">
                    Take a photo, add a few details, and list your excess food in minutes. No complicated forms.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaMedal size={40} />
                  </div>
                  <h4>Earn Credits & Badges</h4>
                  <p className="text-muted mb-0">
                    Get recognized for your contributions with credits, badges, and our donor leaderboard.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaUsers size={40} />
                  </div>
                  <h4>Track Your Impact</h4>
                  <p className="text-muted mb-0">
                    See how many people you've helped and how much food waste you've prevented.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Row className="role-section">
        <Col>
          <h2 className="text-center mb-4">For NGOs</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaBell size={40} />
                  </div>
                  <h4>Real-time Notifications</h4>
                  <p className="text-muted mb-0">
                    Receive instant alerts when food becomes available in your area.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaMapMarkedAlt size={40} />
                  </div>
                  <h4>Location-based Matching</h4>
                  <p className="text-muted mb-0">
                    Find food donations near you with our smart location-matching system.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaHandHoldingHeart size={40} />
                  </div>
                  <h4>Build Donor Relationships</h4>
                  <p className="text-muted mb-0">
                    Create lasting connections with reliable donors in your community.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default HowItWorks;