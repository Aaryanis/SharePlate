import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import anime from 'animejs';

const NotFound = () => {
  useEffect(() => {
    anime({
      targets: '.error-number',
      scale: [0.1, 1],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.error-text',
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      delay: 500,
      duration: 800
    });
    
    anime({
      targets: '.error-actions',
      translateY: [20, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      delay: 1000,
      duration: 800
    });
  }, []);
  
  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <h1 className="error-number display-1 fw-bold text-danger">404</h1>
            <div className="error-text">
              <h2 className="mb-4">Page Not Found</h2>
              <p className="lead mb-5">
                The page you are looking for might have been removed,
                had its name changed, or is temporarily unavailable.
              </p>
            </div>
            <div className="error-actions d-flex justify-content-center gap-3">
              <Link to="/">
                <Button variant="success">
                  <FaHome className="me-2" /> Go Home
                </Button>
              </Link>
              <Link to="/food-map">
                <Button variant="outline-success">
                  <FaSearch className="me-2" /> Find Food
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;