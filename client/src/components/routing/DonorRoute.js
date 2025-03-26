import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const DonorRoute = ({ children }) => {
  const { user, isAuthenticated, loading, isTokenExpired } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.userType !== 'donor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DonorRoute;