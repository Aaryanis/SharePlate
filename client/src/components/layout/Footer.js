import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import anime from 'animejs';

const Footer = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.footer-animated',
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutQuad',
            duration: 800
          });
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(document.querySelector('.footer'));
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <div className="footer-logo footer-animated">
              <img src="/img/logo-white.png" alt="SharePlate Logo" />
            </div>
            <p className="text-light mb-3 footer-animated">
              Connecting food donors with NGOs to reduce waste and fight hunger.
            </p>
            <div className="footer-social footer-animated">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </Col>
          
          <Col md={2} sm={6} className="mb-4">
            <h5 className="footer-animated">Quick Links</h5>
            <ul className="footer-links">
              <li className="footer-animated">
                <Link to="/">Home</Link>
              </li>
              <li className="footer-animated">
                <Link to="/about">About Us</Link>
              </li>
              <li className="footer-animated">
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li className="footer-animated">
                <Link to="/food-map">Food Map</Link>
              </li>
              <li className="footer-animated">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <h5 className="footer-animated">For Donors</h5>
            <ul className="footer-links">
              <li className="footer-animated">
                <Link to="/register">Register as Donor</Link>
              </li>
              <li className="footer-animated">
                <Link to="/donor/dashboard">Donor Dashboard</Link>
              </li>
              <li className="footer-animated">
                <Link to="/donor/food/add">Add Food Donation</Link>
              </li>
              <li className="footer-animated">
                <Link to="/donor/donations">My Donations</Link>
              </li>
              <li className="footer-animated">
                <Link to="/donor/ratings">My Ratings</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3} sm={6} className="mb-4">
            <h5 className="footer-animated">For NGOs</h5>
            <ul className="footer-links">
              <li className="footer-animated">
                <Link to="/register">Register as NGO</Link>
              </li>
              <li className="footer-animated">
                <Link to="/ngo/dashboard">NGO Dashboard</Link>
              </li>
              <li className="footer-animated">
                <Link to="/ngo/pickups">Available Pickups</Link>
              </li>
              <li className="footer-animated">
                <Link to="/ngo/donations">My Collections</Link>
              </li>
            </ul>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <Row>
            <Col md={6} className="text-md-start text-center mb-md-0 mb-3">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} SharePlate. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end text-center">
              <p className="mb-0">
                Made with <FaHeart className="text-danger mx-1" /> to fight hunger
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;