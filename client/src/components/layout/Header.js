import React, { useState, useContext, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Badge, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaUtensils, FaBuilding } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import anime from 'animejs';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { notifications, clearNotification } = useContext(SocketContext);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Animate navbar on scroll
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 30) {
          navbar.classList.add('bg-white', 'shadow-sm');
        } else {
          navbar.classList.remove('bg-white', 'shadow-sm');
        }
      }
    });
    
    // Animate logo
    anime({
      targets: '.navbar-brand img',
      scale: [0.8, 1],
      opacity: [0, 1],
      easing: 'easeOutElastic(1, .8)',
      duration: 1000
    });
    
    // Animate navbar items
    anime({
      targets: '.nav-item',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);

  // Handle new notification animation
  useEffect(() => {
    if (notifications.length > 0) {
      anime({
        targets: '.notification-badge',
        scale: [1, 1.25, 1],
        duration: 600,
        easing: 'easeInOutQuad'
      });
    }
  }, [notifications]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get dashboard link based on user type
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/login';
    return user.userType === 'donor' ? '/donor/dashboard' : '/ngo/dashboard';
  };
  
  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      expanded={expanded}
      className="navbar transition-all py-3"
    >
      <Container>
        <Link to="/" className="navbar-brand">
          <img 
            src="/img/logo.png" 
            alt="SharePlate Logo" 
            className="d-inline-block align-top"
          />
        </Link>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <NavLink to="/" className="nav-link" onClick={() => setExpanded(false)}>
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/about" className="nav-link" onClick={() => setExpanded(false)}>
                About
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/how-it-works" className="nav-link" onClick={() => setExpanded(false)}>
                How It Works
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/food-map" className="nav-link" onClick={() => setExpanded(false)}>
                Food Map
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/contact" className="nav-link" onClick={() => setExpanded(false)}>
                Contact
              </NavLink>
            </Nav.Item>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                {/* Notifications Dropdown */}
                <Dropdown align="end" className="me-2">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="notification-dropdown"
                    className="border-0 bg-transparent position-relative"
                  >
                    <FaBell className="fs-5" />
                    {notifications.length > 0 && (
                      <Badge 
                        bg="danger" 
                        pill 
                        className="position-absolute top-0 start-100 translate-middle notification-badge"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ minWidth: '300px' }}>
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {notifications.length === 0 ? (
                      <Dropdown.Item className="text-muted text-center py-3">
                        No new notifications
                      </Dropdown.Item>
                    ) : (
                      notifications.map((notification, index) => (
                        <Dropdown.Item 
                          key={index}
                          onClick={() => clearNotification(index)}
                          className="border-bottom"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{notification.message}</span>
                            <Badge bg="primary" pill>New</Badge>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
                
                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="user-dropdown"
                    className="border-0 bg-transparent d-flex align-items-center"
                  >
                    <FaUserCircle className="fs-5 me-1" />
                    <span className="d-none d-md-inline">{user?.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={getDashboardLink()}>
                      {user?.userType === 'donor' ? (
                        <><FaUtensils className="me-2" /> Donor Dashboard</>
                      ) : (
                        <><FaBuilding className="me-2" /> NGO Dashboard</>
                      )}
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to={user?.userType === 'donor' ? '/donor/profile' : '/ngo/profile'}
                    >
                      <FaUserCircle className="me-2" /> Profile
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Item>
                  <NavLink to="/login" className="nav-link me-2" onClick={() => setExpanded(false)}>
                    Login
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/register" onClick={() => setExpanded(false)}>
                    <Button variant="success" className="btn-donate">
                      Register
                    </Button>
                  </NavLink>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;