import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUtensils, FaImage, FaMapMarkerAlt, FaCalendarAlt, FaInfo, FaClock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import api from '../../utils/api';
import MapLocationPicker from '../../components/common/MapLocationPicker';
import anime from 'animejs';

const FoodForm = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { notifyNewFood } = useContext(SocketContext);
  const navigate = useNavigate();
  
  const [isEdit, setIsEdit] = useState(false);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [location, setLocation] = useState({
    coordinates: [0, 0],
    address: ''
  });
  
  // Form validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    foodType: Yup.string()
      .required('Food type is required'),
    quantity: Yup.string()
      .required('Quantity is required'),
    freshUntil: Yup.date()
      .required('Freshness timeframe is required')
      .min(new Date(), 'Fresh until date cannot be in the past'),
    pickupInstructions: Yup.string()
      .required('Pickup instructions are required')
  });
  
  // Animation effect
  useEffect(() => {
    anime({
      targets: '.form-card',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutQuad',
      duration: 1000
    });
    
    anime({
      targets: '.form-section',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(150, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);
  
  // Set initial location from user profile
  useEffect(() => {
    if (user?.location?.coordinates) {
      setLocation({
        coordinates: user.location.coordinates,
        address: user.address || ''
      });
    }
  }, [user]);
  
  // Fetch food data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      setLoading(true);
      
      api.get(`/api/food/${id}`)
        .then(res => {
          const foodData = res.data.data;
          setFood(foodData);
          
          if (foodData.location?.coordinates) {
            setLocation({
              coordinates: foodData.location.coordinates,
              address: foodData.location.address || ''
            });
          }
          
          if (foodData.images && foodData.images.length > 0) {
            // Set preview images for existing images
            const previews = foodData.images.map(image => ({
              url: `/uploads/${image}`,
              name: image,
              isExisting: true
            }));
            setPreviewImages(previews);
          }
        })
        .catch(err => {
          console.error('Error fetching food data:', err);
          setError('Failed to load food data for editing');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setSelectedFiles([...selectedFiles, ...files]);
      
      // Create URL previews for new files
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isExisting: false
      }));
      
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };
  
  // Remove preview image
  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const removedImage = updatedPreviews[index];
    
    // If it's a newly added image, revoke the object URL
    if (!removedImage.isExisting) {
      URL.revokeObjectURL(removedImage.url);
      
      // Also remove from selectedFiles
      const updatedFiles = selectedFiles.filter(file => file.name !== removedImage.name);
      setSelectedFiles(updatedFiles);
    }
    
    // Remove from previews
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };
  
  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setError('');
    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form values to FormData
      Object.keys(values).forEach(key => {
        if (key === 'freshUntil') {
          formData.append(key, values[key].toISOString());
        } else {
          formData.append(key, values[key]);
        }
      });
      
      // Add location data
      formData.append('location', JSON.stringify(location));
      
      // Add files to FormData
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      let response;
      
      if (isEdit) {
        // Update existing food listing
        response = await api.put(`/api/food/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          navigate('/donor/dashboard', { 
            state: { 
              success: true, 
              message: 'Food listing updated successfully!' 
            } 
          });
        }
      } else {
        // Create new food listing
        response = await api.post('/api/food', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          // Notify NGOs through socket
          notifyNewFood(response.data.data);
          
          navigate('/donor/dashboard', { 
            state: { 
              success: true, 
              message: 'Food listed successfully! NGOs have been notified.' 
            } 
          });
        }
      }
    } catch (err) {
      console.error('Error submitting food form:', err);
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading food data...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 mt-4">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="form-card border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">
                <FaUtensils className="text-success me-2" />
                {isEdit ? 'Edit Food Donation' : 'Share Food Donation'}
              </h2>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              <Formik
                initialValues={{
                  title: food?.title || '',
                  description: food?.description || '',
                  foodType: food?.foodType || '',
                  quantity: food?.quantity || '',
                  freshUntil: food?.freshUntil ? new Date(food.freshUntil) : new Date(Date.now() + 24 * 60 * 60 * 1000),
                  pickupInstructions: food?.pickupInstructions || ''
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
                  setFieldValue
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="form-section mb-4">
                      <h5 className="form-section-title">
                        <FaInfo className="me-2" />
                        Basic Information
                      </h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Food Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.title && errors.title}
                          placeholder="e.g., Leftover Catering Food from Event"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.description && errors.description}
                          placeholder="Describe the food in detail (type, condition, quantity, etc.)"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Food Type</Form.Label>
                            <Form.Select
                              name="foodType"
                              value={values.foodType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.foodType && errors.foodType}
                            >
                              <option value="">Select Type</option>
                              <option value="Vegetarian">Vegetarian</option>
                              <option value="Non-Vegetarian">Non-Vegetarian</option>
                              <option value="Vegan">Vegan</option>
                              <option value="Mixed">Mixed</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.foodType}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="text"
                              name="quantity"
                              value={values.quantity}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.quantity && errors.quantity}
                              placeholder="e.g., 5 boxes, Serves 20 people"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.quantity}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaClock className="me-2" />
                          Fresh Until
                        </Form.Label>
                        <DatePicker
                          selected={values.freshUntil}
                          onChange={date => setFieldValue('freshUntil', date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className={`form-control ${touched.freshUntil && errors.freshUntil ? 'is-invalid' : ''}`}
                          minDate={new Date()}
                        />
                        {touched.freshUntil && errors.freshUntil && (
                          <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                            {errors.freshUntil}
                          </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                          Select when the food will no longer be fresh
                        </Form.Text>
                      </Form.Group>
                    </div>
                    
                    <div className="form-section mb-4">
                      <h5 className="form-section-title">
                        <FaImage className="me-2" />
                        Food Images
                      </h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Upload Images</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                        <Form.Text className="text-muted">
                          Upload clear images of the food (max 5 images)
                        </Form.Text>
                      </Form.Group>
                      
                      {previewImages.length > 0 && (
                        <div className="image-preview-multiple mb-3">
                          <Row>
                            {previewImages.map((image, index) => (
                              <Col key={index} xs={6} md={3} className="mb-3">
                                <div className="preview-item position-relative">
                                  <img 
                                    src={image.url} 
                                    alt={`Preview ${index + 1}`} 
                                    className="img-fluid rounded"
                                  />
                                  <Button 
                                    variant="danger" 
                                    size="sm" 
                                    className="position-absolute top-0 end-0 rounded-circle p-1 m-1"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    &times;
                                  </Button>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-section mb-4">
                      <h5 className="form-section-title">
                        <FaMapMarkerAlt className="me-2" />
                        Pickup Location
                      </h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Select Location on Map</Form.Label>
                        <MapLocationPicker 
                          setLocation={setLocation} 
                          initialLocation={location} 
                          height="300px"
                        />
                        <Form.Text className="text-muted">
                          Confirm the pickup location on the map
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Pickup Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="pickupInstructions"
                          value={values.pickupInstructions}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.pickupInstructions && errors.pickupInstructions}
                          placeholder="e.g., Come to the back entrance, Ask for manager, Call when arriving"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pickupInstructions}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        type="submit"
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            {isEdit ? 'Updating...' : 'Sharing...'}
                          </>
                        ) : (
                          isEdit ? 'Update Food Listing' : 'Share Food'
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/donor/dashboard')}
                      >
                        Cancel
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

export default FoodForm;