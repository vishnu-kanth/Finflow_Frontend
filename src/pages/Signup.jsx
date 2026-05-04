import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pro-page animate-fade-in">
      <div className="login-pro-container">
        
        {/* Left Side: Branding/Visual */}
        <div className="login-visual-panel">
          <div className="visual-content">
            <div className="pro-logo-badge">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="visual-title">FinFlow</h1>
            <p className="visual-tagline">Advanced Wealth & Loan Intelligence</p>
            
            <div className="visual-features">
              <div className="v-feature">
                <div className="v-dot"></div>
                <span>Institutional-grade security</span>
              </div>
              <div className="v-feature">
                <div className="v-dot"></div>
                <span>Real-time disbursement tracking</span>
              </div>
            </div>
          </div>
          <div className="visual-overlay"></div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="login-form-panel">
          <div className="form-inner">
            <div className="form-header">
              <h2 className="pro-header-title">Join FinFlow</h2>
              <p className="pro-header-subtitle">Create an account to manage your applications.</p>
            </div>

            {error && (
              <div className="pro-error-banner animate-slide-up">
                <div className="error-icon">!</div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="pro-form">
              <div className="pro-input-group">
                <label className="pro-label">Full Name</label>
                <div className="pro-input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="pro-input-field"
                    placeholder="Vishnu Kanth"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pro-input-group">
                <label className="pro-label">Professional Email</label>
                <div className="pro-input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="pro-input-field"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="pro-input-group">
                <label className="pro-label">Secure Password</label>
                <div className="pro-input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    className="pro-input-field"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="pro-login-btn" 
                disabled={loading}
              >
                {loading ? (
                  <div className="pro-spinner"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </button>
            </form>

            <div className="pro-footer">
              <p>
                Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
