import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Activity, CloudUpload, ArrowRight, Lock, Users, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page animate-fade-in">
      
      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <ShieldCheck className="landing-logo-icon" size={28} />
          <span>FinFlow</span>
        </Link>
        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>Login</Link>
          <Link to="/signup" className="landing-btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Zap size={16} /> Version 2.0 Now Live
        </div>
        <h1>Smart Loan Management<br/>Made Simple</h1>
        <p>Apply, track, and manage loans seamlessly with a secure and transparent system.</p>
        <div className="landing-hero-btns">
          <Link to="/signup" className="landing-btn-primary">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="landing-btn-outline">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="section-header">
          <h2>Platform Features</h2>
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Everything you need to manage the complete loan lifecycle.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={24} />
            </div>
            <h3>Easy Loan Application</h3>
            <p>Submit comprehensive loan applications in minutes with our streamlined form interfaces.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Activity size={24} />
            </div>
            <h3>Real-time Status Tracking</h3>
            <p>Monitor your application's progress through the approval pipeline with live updates.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <CloudUpload size={24} />
            </div>
            <h3>Secure Document Upload</h3>
            <p>Safely upload and store sensitive financial documents securely via Cloudinary.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={24} />
            </div>
            <h3>Admin Verification System</h3>
            <p>Robust administrative tools for rapid document verification and decision making.</p>
          </div>
        </div>
      </section>

      {/* Stepper (How it Works) */}
      <section className="landing-stepper">
        <div className="section-header">
          <h2 style={{ color: 'white' }}>How It Works</h2>
          <p style={{ color: '#94a3b8' }}>Four simple steps to secure your financial future.</p>
        </div>
        
        <div className="stepper-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Sign Up</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Create your account</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Apply for Loan</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Enter financial details</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Upload Documents</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Provide necessary proofs</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <h4>Get Approval</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Receive funds securely</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="landing-trust">
        <div className="section-header">
          <h2>Why Trust FinFlow?</h2>
        </div>
        
        <div className="trust-grid">
          <div className="trust-item">
            <Lock size={20} />
            <span>Secure JWT Authentication</span>
          </div>
          <div className="trust-item">
            <Users size={20} />
            <span>Role-Based Access Control</span>
          </div>
          <div className="trust-item">
            <ShieldCheck size={20} />
            <span>Strict Data Isolation</span>
          </div>
          <div className="trust-item">
            <Zap size={20} />
            <span>Lightning Fast Processing</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-hero" style={{ padding: '6rem 5%', background: 'white' }}>
        <h2>Start Your Loan Journey Today</h2>
        <p style={{ marginBottom: '2rem' }}>Experience the most streamlined financial application process available.</p>
        <Link to="/signup" className="landing-btn-primary">
          Apply Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <ShieldCheck className="landing-logo-icon" size={24} />
          <span>FinFlow</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
          Smart Loan Management Made Simple. Secure, transparent, and scalable.
        </p>
        
        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
        
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} FinFlow. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;
