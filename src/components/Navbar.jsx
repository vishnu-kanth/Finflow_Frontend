import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  

  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(x => x);
    if (path.length === 0) return 'Overview';
    return path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
  };

  return (
    <nav className="pro-navbar">
      <div className="navbar-left">
        <div className="breadcrumb-wrapper">
          <span className="root-path">Workspace</span>
          <span className="breadcrumb-sep">/</span>
          <span className="current-path">{getBreadcrumbs()}</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="search-trigger">
          <Search size={18} />
        </button>

        <button className="notif-trigger">
          <Bell size={18} />
        </button>
        
        <div className="profile-trigger" onClick={() => navigate('/profile')}>
          <div className="avatar-circle">
            {user?.sub?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-xs font-bold text-slate-600">Profile</span>
        </div>
        <button 
          className="notif-trigger ml-2" 
          onClick={handleLogout} 
          title="Sign Out"
          style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
