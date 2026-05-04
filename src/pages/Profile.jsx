import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Activity, Key } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const getRoleBadgeClass = (role) => {
    if (role === 'ROLE_ADMIN') return 'role-badge admin';
    return 'role-badge';
  };

  const formatRole = (role) => {
    if (!role) return 'User';
    return role.replace('ROLE_', '').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="profile-container animate-fade-in">
      
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your professional identity and security settings.</p>
      </div>

      <div className="profile-grid">
        
        {/* Left Col: Identity Card */}
        <div className="profile-card identity-card">
          <div className="identity-cover"></div>
          
          <div className="identity-avatar">
            {user?.sub?.[0]?.toUpperCase() || 'A'}
          </div>
          
          <h2 className="identity-name">{user?.name || user?.username || user?.sub?.split('@')[0] || 'User'}</h2>
          <p className="identity-email">{user?.sub || 'user@example.com'}</p>
          
          <div className={getRoleBadgeClass(user?.role)}>
            <ShieldCheck size={14} />
            {formatRole(user?.role)}
          </div>
        </div>

        {/* Right Col: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="profile-card">
            <div className="profile-card-header">
              <User size={20} style={{ color: '#4f46e5' }} /> Personal Information
            </div>
            
            <div className="profile-card-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user?.name || user?.username || 'Not Provided'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Primary Email</span>
                  <span className="detail-value">
                    {user?.sub} <Shield size={14} style={{ color: '#059669' }} />
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Account ID</span>
                  <span className="detail-value">
                    <span className="detail-id-badge">USR-{user?.id || Math.floor(Math.random() * 10000)}</span>
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">System Status</span>
                  <span className="detail-value" style={{ color: '#059669' }}>
                    <Activity size={16} /> Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card-header">
              <Key size={20} style={{ color: '#4f46e5' }} /> Security Settings
            </div>
            
            <div className="profile-card-body">
              <div className="security-row">
                <div>
                  <div className="security-title">Password Authentication</div>
                  <div className="security-desc">Last changed 30 days ago</div>
                </div>
                <button className="btn-update">
                  Update
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
