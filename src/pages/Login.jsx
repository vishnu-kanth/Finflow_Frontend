import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check credentials.');
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

        {/* Right Side: Login Form */}
        <div className="login-form-panel">
          <div className="form-inner">
            <div className="form-header">
              <h2 className="pro-header-title">Welcome Back</h2>
              <p className="pro-header-subtitle">Enter your credentials to access your secure portal.</p>
            </div>

            {error && (
              <div className="pro-error-banner animate-slide-up">
                <div className="error-icon">!</div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="pro-form">
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
                <div className="flex justify-between items-center mb-1">
                  <label className="pro-label">Secure Password</label>
                  <Link to="#" className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Forgot?</Link>
                </div>
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
                    <span>Sign In to Portal</span>
                    <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </button>
            </form>

            <div className="pro-footer">
              <p>
                New to the platform? <Link to="/signup" className="signup-link">Apply for Access</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
