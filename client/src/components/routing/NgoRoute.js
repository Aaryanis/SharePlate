import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const NgoRoute = ({ children }) => {
  const { user, isAuthenticated, loading, isTokenExpired } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.userType !== 'ngo') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default NgoRoute;