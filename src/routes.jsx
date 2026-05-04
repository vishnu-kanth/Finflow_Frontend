import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Documents from './pages/Documents';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Reports from './pages/Reports';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_APPLICANT']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Shared Authenticated Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_APPLICANT', 'ROLE_ADMIN']} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<HelpCenter />} />
      </Route>
      
      <Route path="/" element={
        user ? (
          user.role === 'ROLE_ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
        ) : (
          <Landing />
        )
      } />
      <Route path="*" element={
        user?.role === 'ROLE_ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
      } />
    </Routes>
  );
};

export default AppRoutes;
