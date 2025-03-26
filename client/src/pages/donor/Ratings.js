import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaUserAlt, FaBoxOpen, FaCalendarAlt, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import anime from 'animejs';

const Ratings = () => {
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    ratingCounts: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
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
      targets: '.ratings-summary-card',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: 300
    });
  }, []);
  
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/ratings/donor/${user?.id}`);
        setRatings(res.data.data || []);
        
        // Calculate statistics
        const ratingCounts = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        };
        
        res.data.data.forEach(rating => {
          ratingCounts[rating.rating] = (ratingCounts[rating.rating] || 0) + 1;
        });
        
        setStats({
          totalRatings: res.data.count || 0,
          averageRating: res.data.averageRating || 0,
          ratingCounts
        });
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setError('Failed to load ratings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchRatings();
    }
  }, [user]);
  
  useEffect(() => {
    if (!loading && ratings.length > 0) {
      anime({
        targets: '.rating-card',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, [ratings, loading]);
  
  // Calculate percentage for rating bar
  const calculatePercentage = (count) => {
    if (stats.totalRatings === 0) return 0;
    return Math.round((count / stats.totalRatings) * 100);
  };
  
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading ratings...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <div className="mb-4">
        <h1 className="page-title fw-bold">
          <FaStar className="text-warning me-2" />
          My Ratings
        </h1>
        <p className="lead text-muted">See what NGOs are saying about your donations</p>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm ratings-summary-card">
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="text-center border-end">
                  <h2 className="display-1 fw-bold text-warning">{stats.averageRating}</h2>
                  <p className="mb-0">Average Rating</p>
                  <div className="ratings-stars mt-2 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar 
                        key={star} 
                        className={star <= Math.round(stats.averageRating) ? 'text-warning' : 'text-muted'} 
                        size={24} 
                      />
                    ))}
                  </div>
                  <p className="mb-0">Based on {stats.totalRatings} ratings</p>
                </Col>
                
                <Col md={8}>
                  <h5 className="mb-3">Rating Distribution</h5>
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="d-flex align-items-center mb-2">
                      <div className="me-2" style={{ width: '30px' }}>
                        {star} <FaStar className="text-warning" size={12} />
                      </div>
                      <div className="flex-grow-1 me-3">
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${calculatePercentage(stats.ratingCounts[star])}%` }}
                            aria-valuenow={calculatePercentage(stats.ratingCounts[star])} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                      <div style={{ width: '50px', textAlign: 'right' }}>
                        {stats.ratingCounts[star]}
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h4 className="mb-3">Rating Reviews</h4>
      
      {ratings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-5 text-center">
            <FaStar className="text-muted mb-3" size={40} />
            <h5>No Ratings Yet</h5>
            <p className="text-muted">
              You haven't received any ratings yet. Ratings will appear here after NGOs pick up your food donations.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {ratings.map((rating, index) => (
            <Col lg={6} className="mb-4" key={rating._id}>
              <Card className="rating-card h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div className="rating-circle bg-success text-white d-flex align-items-center justify-content-center rounded-circle" style={{ width: '50px', height: '50px' }}>
                          <span className="fw-bold">{rating.rating}</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-1">
                          {rating.ngo?.name || 'NGO Organization'}
                        </h5>
                        <small className="text-muted">
                          {formatRelativeTime(rating.createdAt)}
                        </small>
                      </div>
                    </div>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < rating.rating ? 'text-warning' : 'text-muted'} 
                          size={16} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {rating.review ? (
                    <div className="rating-review mb-3 bg-light p-3 rounded">
                      <FaQuoteLeft className="text-muted me-2" size={12} />
                      <span className="fst-italic">{rating.review}</span>
                      <FaQuoteRight className="text-muted ms-2" size={12} />
                    </div>
                  ) : (
                    <div className="rating-review mb-3 bg-light p-3 rounded text-muted">
                      <FaQuoteLeft className="me-2" size={12} />
                      No written review provided
                      <FaQuoteRight className="ms-2" size={12} />
                    </div>
                  )}
                  
                  <div className="food-details d-flex align-items-center">
                    <FaBoxOpen className="text-success me-2" />
                    <span>
                      For: <strong>{rating.donation?.foodDetails?.title || 'Food Donation'}</strong>
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Ratings;