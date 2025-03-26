import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import MapLocationPicker from '../../components/common/MapLocationPicker';
import anime from 'animejs';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState({
    coordinates: [0, 0],
    address: ''
  });
  
  useEffect(() => {
    anime({
      targets: '.profile-card',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    if (user?.location?.coordinates) {
      setLocation({
        coordinates: user.location.coordinates,
        address: user.address || ''
      });
    }
  }, [user]);
  
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    organization: Yup.string()
      .required('Organization name is required'),
    phone: Yup.string()
      .required('Phone number is required'),
    address: Yup.string()
      .required('Address is required')
  });
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const updatedUser = {
        ...values,
        location
      };
      
      const res = await api.put('/api/users/me', updatedUser);
      
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        
        // Animate success message
        anime({
          targets: '.success-alert',
          scale: [0.9, 1],
          opacity: [0, 1],
          easing: 'easeOutQuad',
          duration: 800
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading profile...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="profile-card border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">
                <FaBuilding className="text-success me-2" />
                NGO Profile
              </h2>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="success-alert" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
              
              <Formik
                initialValues={{
                  name: user.name || '',
                  organization: user.organization || '',
                  phone: user.phone || '',
                  address: user.address || ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
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
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaUser className="me-2 text-success" />
                            Contact Person Name
                          </Form.Label>
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
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaBuilding className="me-2 text-success" />
                            Organization Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="organization"
                            value={values.organization}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.organization && errors.organization}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.organization}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaEnvelope className="me-2 text-success" />
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={user.email}
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaPhone className="me-2 text-success" />
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
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
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2 text-success" />
                        Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address && errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2 text-success" />
                        Your Location on Map
                      </Form.Label>
                      <MapLocationPicker 
                        setLocation={setLocation} 
                        initialLocation={location} 
                        height="300px"
                      />
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button
                        variant="success"
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="mb-3"
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Updating Profile...
                          </>
                        ) : (
                          'Update Profile'
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

export default Profile;