import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { formatRelativeTime, formatFoodType } from '../../utils/formatters';

const FoodCard = ({ food, index }) => {
  const { _id, title, description, foodType, images, donorName, location, createdAt } = food;
  
  const foodTypeFormatted = formatFoodType(foodType);
  
  return (
    <Card 
      className="food-card animation-stagger h-100" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="food-image-container">
        {images && images.length > 0 ? (
          <img 
            src={`/uploads/${images[0]}`} 
            alt={title} 
            className="food-image"
          />
        ) : (
          <img 
            src="/img/food-placeholder.jpg" 
            alt="Food placeholder" 
            className="food-image"
          />
        )}
        
        <div className="food-badge">
          <Badge bg={foodTypeFormatted.color}>
            {foodTypeFormatted.text}
          </Badge>
        </div>
      </div>
      
      <Card.Body className="food-info">
        <h5 className="food-title">{title}</h5>
        <p className="food-description text-muted mb-3">
          {description}
        </p>
        
        <div className="d-flex align-items-center mb-2">
          <FaMapMarkerAlt className="text-muted me-2" />
          <small className="text-muted">
            {location.address ? location.address : 'Location not specified'}
          </small>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <FaClock className="text-muted me-2" />
          <small className="text-muted">
            {formatRelativeTime(createdAt)}
          </small>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="food-donor">
            By: {donorName || 'Anonymous Donor'}
          </small>
          
          <Link to={`/food/${_id}`}>
            <Button variant="outline-primary" size="sm">View Details</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;