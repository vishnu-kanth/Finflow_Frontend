import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || 'USER'; // Adjust based on your token payload
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-body">
        <Navbar />
        <main className="main-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
