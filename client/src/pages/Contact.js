import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import anime from 'animejs';
import * as Yup from 'yup';
import { Formik } from 'formik';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    anime({
      targets: '.contact-heading',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.contact-info-card',
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(200, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    anime({
      targets: '.contact-form-card',
      opacity: [0, 1],
      translateX: [50, 0],
      easing: 'easeOutQuad',
      duration: 1000,
      delay: 500
    });
  }, []);
  
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    subject: Yup.string()
      .required('Subject is required')
      .min(5, 'Subject must be at least 5 characters'),
    message: Yup.string()
      .required('Message is required')
      .min(20, 'Message must be at least 20 characters')
  });
  
  // Form submission handler (simulated)
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success
    setFormSubmitted(true);
    setSubmitting(false);
    resetForm();
    
    // Reset form submitted state after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  
  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col className="text-center mb-5">
          <h1 className="contact-heading fw-bold">Contact Us</h1>
          <p className="lead text-muted">Get in touch with our team</p>
        </Col>
      </Row>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="contact-info-card h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Contact Information</h4>
              
              <div className="d-flex align-items-center mb-4">
                <div className="contact-icon me-3 p-3 rounded-circle bg-success text-white">
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="mb-1">Email Us</h6>
                  <p className="mb-0">info@shareplate.org</p>
                  <p className="mb-0">support@shareplate.org</p>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-4">
                <div className="contact-icon me-3 p-3 rounded-circle bg-success text-white">
                  <FaPhone />
                </div>
                <div>
                  <h6 className="mb-1">Call Us</h6>
                  <p className="mb-0">+91 98765 43210</p>
                  <p className="mb-0">+91 12345 67890</p>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="contact-icon me-3 p-3 rounded-circle bg-success text-white">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h6 className="mb-1">Office Location</h6>
                  <p className="mb-0">123 Food Street, Tech Hub</p>
                  <p className="mb-0">Bengaluru, Karnataka 560001</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="contact-form-card border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Send Us a Message</h4>
              
              {formSubmitted && (
                <Alert variant="success" className="mb-4">
                  <FaPaperPlane className="me-2" />
                  Your message has been sent successfully! We'll get back to you soon.
                </Alert>
              )}
              
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  subject: '',
                  message: ''
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
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="name">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
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
                      
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="email">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
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
                    
                    <Form.Group className="mb-3" controlId="subject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.subject && errors.subject}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.subject}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="message">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.message && errors.message}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button
                        variant="success"
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;