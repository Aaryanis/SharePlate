import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUtensils, FaHandHoldingHeart, FaLeaf, FaUsers } from 'react-icons/fa';
import anime from 'animejs';

const About = () => {
  useEffect(() => {
    anime({
      targets: '.page-title',
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.about-section',
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(200, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    anime({
      targets: '.team-card',
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 800 }),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);
  
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col className="text-center mb-5">
          <h1 className="page-title fw-bold">About SharePlate</h1>
          <p className="lead text-muted">Fighting hunger and reducing food waste, one meal at a time</p>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="about-section">
            <h2 className="mb-4">Our Mission</h2>
            <p>
              SharePlate is a platform that connects food donors (restaurants, events, homes) with 
              nearby NGOs to reduce food waste and fight hunger. We believe that no food should go to waste 
              when there are people in need.
            </p>
            <p>
              Our mission is to create a world where excess food from one part of society becomes a 
              valuable resource for another, where we reduce food waste to zero while ensuring everyone 
              has access to nutritious meals.
            </p>
          </div>
        </Col>
        <Col lg={6}>
          <div className="about-section">
            <h2 className="mb-4">Our Vision</h2>
            <p>
              We envision a future where:
            </p>
            <ul>
              <li>Every restaurant, event venue, and household has an easy way to donate excess food</li>
              <li>NGOs and charities can quickly access and distribute donated food to those in need</li>
              <li>Technology bridges the gap between food waste and food scarcity</li>
              <li>Communities come together to support each other through food sharing</li>
            </ul>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col className="about-section">
          <h2 className="text-center mb-5">What Sets Us Apart</h2>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaUtensils size={50} />
                  </div>
                  <h4>Comprehensive Network</h4>
                  <p className="text-muted mb-0">
                    Connect with a vast network of food donors and NGOs in your area
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaHandHoldingHeart size={50} />
                  </div>
                  <h4>Credit System</h4>
                  <p className="text-muted mb-0">
                    Our unique donor credit system ensures quality and reliability
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaLeaf size={50} />
                  </div>
                  <h4>Anonymous Donation</h4>
                  <p className="text-muted mb-0">
                    Option to donate anonymously for those who prefer privacy
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <FaUsers size={50} />
                  </div>
                  <h4>Dual-Recipient Model</h4>
                  <p className="text-muted mb-0">
                    Serve both NGOs and verified individuals in need
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col className="about-section">
          <h2 className="text-center mb-5">Our Team</h2>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="team-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                    <img src="/img/team-1.jpg" alt="Team Member" className="img-fluid" />
                  </div>
                  <h4>Rahul Sharma</h4>
                  <p className="text-success">Founder & CEO</p>
                  <p className="text-muted">
                    Food sustainability expert with 10+ years experience in the restaurant industry
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="team-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                    <img src="/img/team-2.jpg" alt="Team Member" className="img-fluid" />
                  </div>
                  <h4>Priya Patel</h4>
                  <p className="text-success">CTO</p>
                  <p className="text-muted">
                    Tech innovator with a passion for applying technology to solve social problems
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="team-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                    <img src="/img/team-3.jpg" alt="Team Member" className="img-fluid" />
                  </div>
                  <h4>Ajay Singh</h4>
                  <p className="text-success">NGO Relations</p>
                  <p className="text-muted">
                    Former NGO director with extensive experience in food distribution networks
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="team-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                    <img src="/img/team-4.jpg" alt="Team Member" className="img-fluid" />
                  </div>
                  <h4>Meera Kapoor</h4>
                  <p className="text-success">Operations Director</p>
                  <p className="text-muted">
                    Logistics specialist with a background in supply chain management
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

export default About;