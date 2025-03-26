import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaUtensils, FaBuilding, FaUserCircle, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import MapLocationPicker from '../components/common/MapLocationPicker';
import anime from 'animejs';

const Register = () => {
  const { register, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [location, setLocation] = useState({
    coordinates: [0, 0],
    address: ''
  });
  
  // Animation effect
  useEffect(() => {
    anime({
      targets: '.auth-card',
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    if (step === 1) {
      anime({
        targets: '.user-type-card',
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: anime.stagger(200, { start: 300 }),
        easing: 'easeOutQuad',
        duration: 800
      });
    } else {
      anime({
        targets: '.form-group',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 300 }),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, [step]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.userType === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Validation schemas for different steps
  const step2Schema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    phone: Yup.string()
      .required('Phone number is required'),
    address: Yup.string()
      .required('Address is required'),
    organization: userType === 'ngo' ? 
      Yup.string().required('Organization name is required') : 
      Yup.string(),
    isAnonymous: Yup.boolean()
  });

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };
  
  // Form submission handler
  const handleSubmit = async (values, { setSubmitting }) => {
    if (location.coordinates[0] === 0 && location.coordinates[1] === 0) {
      setError('Please select your location on the map or use an alternative method');
      setSubmitting(false);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Combine form data with userType and location
      const userData = {
        ...values,
        userType,
        location
      };

      // Register user
      const result = await register(userData);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
  return (
    <section className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card className="auth-card shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">
                  <FaUtensils className="text-success me-2" />
                  Create SharePlate Account
                </h2>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <ProgressBar 
                  now={step === 1 ? 50 : 100} 
                  className="mb-4"
                  variant="success"
                />
                
                {step === 1 ? (
                  <div className="user-type-selection text-center">
                    <h4 className="mb-4">I want to join as a:</h4>
                    
                    <Row className="justify-content-center">
                      <Col md={5} className="mb-4">
                        <Card 
                          className={`user-type-card h-100 ${userType === 'donor' ? 'border-success' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUserTypeSelect('donor')}
                        >
                          <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                            <div className="display-1 mb-3">🍲</div>
                            <h4>Food Donor</h4>
                            <p className="text-muted mb-0">I want to donate excess food</p>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col md={5} className="mb-4">
                        <Card 
                          className={`user-type-card h-100 ${userType === 'ngo' ? 'border-success' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUserTypeSelect('ngo')}
                        >
                          <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                            <div className="display-1 mb-3">🏢</div>
                            <h4>NGO / Charity</h4>
                            <p className="text-muted mb-0">I want to receive and distribute food</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Formik
                    initialValues={{
                      name: '',
                      email: '',
                      password: '',
                      passwordConfirm: '',
                      phone: '',
                      address: '',
                      organization: '',
                      isAnonymous: false
                    }}
                    validationSchema={step2Schema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="name">
                              <Form.Label>
                                <FaUserCircle className="me-2" />
                                Full Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.name && errors.name}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="email">
                              <Form.Label>
                                <FaEnvelope className="me-2" />
                                Email Address
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && errors.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="password">
                              <Form.Label>
                                <FaLock className="me-2" />
                                Password
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.password && errors.password}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.password}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="passwordConfirm">
                              <Form.Label>
                                <FaLock className="me-2" />
                                Confirm Password
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="passwordConfirm"
                                placeholder="Confirm your password"
                                value={values.passwordConfirm}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.passwordConfirm && errors.passwordConfirm}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.passwordConfirm}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="phone">
                              <Form.Label>
                                <FaPhone className="me-2" />
                                Phone Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.phone && errors.phone}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          
                          <Col md={6}>
                            <Form.Group className="form-group mb-3" controlId="address">
                              <Form.Label>
                                <FaMapMarkerAlt className="me-2" />
                                Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.address && errors.address}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.address}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        {userType === 'ngo' && (
                          <Form.Group className="form-group mb-3" controlId="organization">
                            <Form.Label>
                              <FaBuilding className="me-2" />
                              Organization Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="organization"
                              placeholder="Enter your organization name"
                              value={values.organization}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.organization && errors.organization}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.organization}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}
                        
                        {userType === 'donor' && (
                          <Form.Group className="form-group mb-3" controlId="isAnonymous">
                            <Form.Check
                              type="checkbox"
                              label="Keep my donations anonymous"
                              name="isAnonymous"
                              checked={values.isAnonymous}
                              onChange={handleChange}
                              className="user-select-none"
                            />
                            <Form.Text className="text-muted">
                              Your name will not be visible to NGOs when you donate food
                            </Form.Text>
                          </Form.Group>
                        )}

                        <Form.Group className="form-group mb-4">
                          <Form.Label>
                            <FaMapMarkerAlt className="me-2" />
                            Your Location
                          </Form.Label>
                          <MapLocationPicker setLocation={setLocation} height="300px" />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="outline-secondary"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          
                          <Button
                            variant="success"
                            type="submit"
                            disabled={isSubmitting || isLoading}
                          >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
                
                <div className="text-center mt-4">
                  <p>
                    Already have an account? <Link to="/login" className="text-success">Login</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;