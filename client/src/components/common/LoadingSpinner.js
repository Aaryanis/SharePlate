import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p>{message}</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;