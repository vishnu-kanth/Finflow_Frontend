import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import Chatbot from './components/Chatbot';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#0f172a', color: '#fff', borderRadius: '12px' } }} />
        <AppRoutes />
        <Chatbot />
      </AuthProvider>
    </Router>
  );
}

export default App;
