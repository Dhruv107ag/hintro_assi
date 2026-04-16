import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // We'll handle redirection in the App component logic or redirect here if using a router
    // Since I'm building it as a single-page state-based view (or simple conditional rendering),
    // I will return null or redirect.
    return null; 
  }

  return children;
};

export default ProtectedRoute;
