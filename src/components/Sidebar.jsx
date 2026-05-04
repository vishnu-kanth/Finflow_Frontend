import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, FolderOpen, ShieldCheck, 
  User as UserIcon, Settings, BarChart3, HelpCircle 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const userRole = user?.role || 'USER';

  return (
    <aside className="pro-sidebar">
      <div className="sidebar-logo-section">
        <div className="logo-icon">
          <ShieldCheck size={20} />
        </div>
        <span className="logo-text">FinFlow Pro</span>
      </div>

      <div className="sidebar-scroll">
        <div className="nav-section">
          <h3 className="nav-section-title">Core Platform</h3>
          <nav className="nav-list">
            {user?.role === 'ROLE_APPLICANT' && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <LayoutDashboard size={18} /> <span>Live Dashboard</span>
                </NavLink>
                <NavLink to="/applications" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <FileText size={18} /> <span>My Applications</span>
                </NavLink>
                <NavLink to="/documents" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <FolderOpen size={18} /> <span>Resource Vault</span>
                </NavLink>
              </>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <>
                <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <ShieldCheck size={18} /> <span>Admin Console</span>
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <BarChart3 size={18} /> <span>System Reports</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Preferences</h3>
          <nav className="nav-list">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <UserIcon size={18} /> <span>My Profile</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Settings size={18} /> <span>Settings</span>
            </NavLink>
            <NavLink to="/support" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <HelpCircle size={18} /> <span>Help Center</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-mini">
          <div className="avatar-mini">
            {user?.sub?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="user-details-mini">
            <p className="user-name-mini">{user?.sub || 'Administrator'}</p>
            <p className="user-role-mini">{userRole.replace('ROLE_', '')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
