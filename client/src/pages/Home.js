import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHandHoldingHeart, FaMapMarkedAlt, FaUsers, FaAppleAlt, FaAward, FaBuilding } from 'react-icons/fa';
import anime from 'animejs';
import api from '../utils/api';
import StatCard from '../components/common/StatCard';
import FoodCard from '../components/common/FoodCard';
import { animateHero, animateFeatures, animateStats, animateSteps, animateTestimonials, animateCta } from '../utils/animations';

const Home = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalNgos: 0,
    impactedLives: 0
  });
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Run hero animation
    animateHero();
    
    // Setup intersection observers for scroll animations
    const featuresSection = document.querySelector('.features-section');
    const statsSection = document.querySelector('.stats-section');
    const stepsSection = document.querySelector('.how-it-works');
    const testimonialsSection = document.querySelector('.testimonials');
    const ctaSection = document.querySelector('.cta-section');
    
    const observerOptions = {
      threshold: 0.1
    };
    
    const featuresObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateFeatures(true);
          featuresObserver.unobserve(featuresSection);
        }
      },
      observerOptions
    );
    
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats(true);
          statsObserver.unobserve(statsSection);
        }
      },
      observerOptions
    );
    
    const stepsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateSteps(true);
          stepsObserver.unobserve(stepsSection);
        }
      },
      observerOptions
    );
    
    const testimonialsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateTestimonials(true);
          testimonialsObserver.unobserve(testimonialsSection);
        }
      },
      observerOptions
    );
    
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCta(true);
          ctaObserver.unobserve(ctaSection);
        }
      },
      observerOptions
    );
    
    // Observe sections
    if (featuresSection) featuresObserver.observe(featuresSection);
    if (statsSection) statsObserver.observe(statsSection);
    if (stepsSection) stepsObserver.observe(stepsSection);
    if (testimonialsSection) testimonialsObserver.observe(testimonialsSection);
    if (ctaSection) ctaObserver.observe(ctaSection);
    
    // Cleanup
    return () => {
      if (featuresSection) featuresObserver.unobserve(featuresSection);
      if (statsSection) statsObserver.unobserve(statsSection);
      if (stepsSection) stepsObserver.unobserve(stepsSection);
      if (testimonialsSection) testimonialsObserver.unobserve(testimonialsSection);
      if (ctaSection) ctaObserver.unobserve(ctaSection);
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get recent food listings
        const foodRes = await api.get('/api/food?limit=6');
        setFoods(foodRes.data.data);
        
        // Set stats (in a real app, we'd get these from the API)
        setStats({
          totalDonations: 1250,
          totalDonors: 375,
          totalNgos: 48,
          impactedLives: 4800
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section" style={{ marginTop: '76px' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4 animated-element">
                  Reduce Food Waste, <span className="text-success">Fight Hunger</span>
                </h1>
                <p className="lead mb-4 animated-element">
                  SharePlate connects restaurants, events, and homes with excess food to nearby NGOs, 
                  reducing waste and helping those in need.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4 animated-element">
                  <Link to="/register">
                    <Button variant="success" size="lg" className="btn-donate">
                      Donate Food
                    </Button>
                  </Link>
                  <Link to="/food-map">
                    <Button variant="outline-success" size="lg">
                      Find Available Food
                    </Button>
                  </Link>
                </div>
                <p className="text-muted animated-element">
                  <small>Already have an account? <Link to="/login">Login here</Link></small>
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image text-center">
                <img 
                  src="/img/hero-image.png" 
                  alt="SharePlate Hero" 
                  className="img-fluid rounded"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">How SharePlate Works</h2>
            <p className="lead text-muted">A simple process to share food and make a difference</p>
          </div>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card animation-stagger h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mx-auto">
                    <FaUtensils />
                  </div>
                  <h4 className="mb-3">Donate Food</h4>
                  <p className="text-muted mb-0">
                    Restaurants, event managers, and individuals can easily list surplus food for donation.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card animation-stagger h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mx-auto">
                    <FaMapMarkedAlt />
                  </div>
                  <h4 className="mb-3">Smart Matching</h4>
                  <p className="text-muted mb-0">
                    Our platform automatically notifies nearby NGOs about available food donations.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card animation-stagger h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mx-auto">
                    <FaHandHoldingHeart />
                  </div>
                  <h4 className="mb-3">Feed The Hungry</h4>
                  <p className="text-muted mb-0">
                    NGOs collect and distribute the food to those who need it most in the community.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section text-white">
        <Container>
          <Row>
            <Col md={3} sm={6} className="mb-4 mb-md-0">
              <StatCard
                icon={<FaUtensils />}
                count={stats.totalDonations}
                label="Food Donations"
                color="white"
                iconBg="success"
                delay={0}
              />
            </Col>
            
            <Col md={3} sm={6} className="mb-4 mb-md-0">
              <StatCard
                icon={<FaUsers />}
                count={stats.totalDonors}
                label="Food Donors"
                color="white"
                iconBg="success"
                delay={200}
              />
            </Col>
            
            <Col md={3} sm={6} className="mb-4 mb-md-0">
              <StatCard
                icon={<FaBuilding />}
                count={stats.totalNgos}
                label="Partner NGOs"
                color="white"
                iconBg="success"
                delay={400}
              />
            </Col>
            
            <Col md={3} sm={6} className="mb-4 mb-md-0">
              <StatCard
                icon={<FaHandHoldingHeart />}
                count={stats.impactedLives}
                label="Lives Impacted"
                color="white"
                iconBg="success"
                delay={600}
              />
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* How It Works Section (Detailed Steps) */}
      <section className="how-it-works">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">The Process</h2>
            <p className="lead text-muted">Our simple 4-step process makes food sharing easy</p>
          </div>
          
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="step-card animation-stagger">
                <div className="step-number">1</div>
                <h4 className="mb-3">List Your Food</h4>
                <p className="text-muted mb-0">
                  Take a photo, add details about your excess food, and share your location.
                </p>
              </div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <div className="step-card animation-stagger">
                <div className="step-number">2</div>
                <h4 className="mb-3">NGOs Get Notified</h4>
                <p className="text-muted mb-0">
                  Nearby NGOs receive real-time notifications about available food.
                </p>
              </div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <div className="step-card animation-stagger">
                <div className="step-number">3</div>
                <h4 className="mb-3">Confirm Pickup</h4>
                <p className="text-muted mb-0">
                  NGOs confirm pickup, and donors receive notification about collection time.
                </p>
              </div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <div className="step-card animation-stagger">
                <div className="step-number">4</div>
                <h4 className="mb-3">Rate & Earn Credits</h4>
                <p className="text-muted mb-0">
                  After successful pickup, both parties can rate each other and donors earn credits.
                </p>
              </div>
            </Col>
          </Row>
          
          <div className="text-center mt-4">
            <Link to="/how-it-works">
              <Button variant="outline-success">Learn More About The Process</Button>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Recent Food Listings */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Recent Food Listings</h2>
            <Link to="/food-map">
              <Button variant="outline-success">View All</Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading recent food listings...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-5">
              <p>No food listings available at the moment.</p>
              <Link to="/register">
                <Button variant="success">Be the first to donate food</Button>
              </Link>
            </div>
          ) : (
            <Row>
              {foods.map((food, index) => (
                <Col lg={4} md={6} className="mb-4" key={food._id}>
                  <FoodCard food={food} index={index} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
      
      {/* Testimonials */}
      <section className="testimonials bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">What People Say</h2>
            <p className="lead text-muted">Testimonials from our users</p>
          </div>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card animation-stagger h-100">
                <Card.Body>
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src="/img/testimonial-1.jpg" alt="Testimonial" className="img-fluid" />
                    </div>
                    <div>
                      <h5 className="mb-0">Arjun Sharma</h5>
                      <p className="text-muted mb-0">Restaurant Owner</p>
                    </div>
                  </div>
                  <div className="testimonial-quote">
                    <p>
                      "SharePlate has transformed how we handle excess food. Instead of throwing it away, 
                      we now regularly donate to local NGOs. It's simple, efficient, and rewarding."
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="testimonial-card animation-stagger h-100">
                <Card.Body>
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src="/img/testimonial-2.jpg" alt="Testimonial" className="img-fluid" />
                    </div>
                    <div>
                      <h5 className="mb-0">Priya Patel</h5>
                      <p className="text-muted mb-0">NGO Coordinator</p>
                    </div>
                  </div>
                  <div className="testimonial-quote">
                    <p>
                      "The real-time notifications about available food have revolutionized our operations. 
                      We can now serve fresh food to more people in need thanks to SharePlate's network."
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="testimonial-card animation-stagger h-100">
                <Card.Body>
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src="/img/testimonial-3.jpg" alt="Testimonial" className="img-fluid" />
                    </div>
                    <div>
                      <h5 className="mb-0">Rajesh Kumar</h5>
                      <p className="text-muted mb-0">Event Manager</p>
                    </div>
                  </div>
                  <div className="testimonial-quote">
                    <p>
                      "After corporate events, we often had large amounts of food leftover. SharePlate 
                      connects us with NGOs who can collect it quickly, ensuring nothing goes to waste."
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Call to Action */}
      <section className="cta-section">
        <Container>
          <h2 className="mb-4 animated-element">Join The Movement Today</h2>
          <p className="mb-4 mx-auto animated-element" style={{ maxWidth: '700px' }}>
            Whether you're a restaurant owner, event manager, home cook, or an NGO, 
            you can make a difference. Join SharePlate today and be part of the solution 
            to food waste and hunger.
          </p>
          <div className="cta-buttons animated-element">
            <Row className="justify-content-center">
              <Col md={4} sm={6} className="mb-3">
                <div className="d-grid">
                  <Link to="/register">
                    <Button variant="light" size="lg" className="w-100">
                      Register as Donor
                    </Button>
                  </Link>
                </div>
              </Col>
              <Col md={4} sm={6} className="mb-3">
                <div className="d-grid">
                  <Link to="/register">
                    <Button variant="warning" size="lg" className="w-100">
                      Register as NGO
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;