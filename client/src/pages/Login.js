import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUtensils, FaUserCircle, FaLock } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';
import anime from 'animejs';

const Login = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation effect
  useEffect(() => {
    anime({
      targets: '.auth-card',
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.form-group',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || 
        (user.userType === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
      navigate(from);
    }
  }, [isAuthenticated, user, navigate, location]);
  
  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
  return (
    <section className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="auth-card overflow-hidden">
              <Row className="g-0">
                <Col lg={5} className="d-none d-lg-block">
                  <div className="auth-sidebar h-100">
                    <h2>Welcome Back</h2>
                    <p>
                      Log in to your SharePlate account to continue your journey in fighting food waste and hunger.
                    </p>
                    <img 
                      src="/img/login-illustration.png" 
                      alt="Login" 
                      className="img-fluid mt-4"
                    />
                  </div>
                </Col>
                
                <Col lg={7}>
                  <div className="auth-form">
                    <h3>
                      <FaUtensils className="text-success me-2" />
                      Login to SharePlate
                    </h3>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Formik
                      initialValues={{
                        email: '',
                        password: ''
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                      }) => (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-4" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FaUserCircle />
                              </span>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && errors.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                          
                          <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FaLock />
                              </span>
                              <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.password && errors.password}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                          
                          <div className="d-grid mb-4">
                            <Button
                              variant="success"
                              type="submit"
                              size="lg"
                              disabled={isSubmitting || isLoading}
                            >
                              {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                          </div>
                          
                          <div className="text-center">
                            <p className="mb-0">
                              Don't have an account?{' '}
                              <Link to="/register" className="text-success">
                                Register Now
                              </Link>
                            </p>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;