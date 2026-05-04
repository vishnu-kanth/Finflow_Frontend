import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { documentService } from '../services/documentService';
import { useNavigate } from 'react-router-dom';
import { User, Lock, FileText, Settings as PrefIcon, LogOut, Shield, Database, Users } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'ROLE_APPLICANT') {
          const myDocs = await documentService.getMyDocuments();
          if (Array.isArray(myDocs)) setDocs(myDocs);
        } else if (user?.role === 'ROLE_ADMIN') {
          const sysStats = await adminService.getStats();
          setStats(sysStats);
        }
      } catch (err) {
        console.error("Failed to load settings data", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard-wrapper animate-fade-in">
      
      <div className="mb-5">
        <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)'}}>Settings</h1>
        <p className="text-secondary" style={{fontSize: '1.1rem'}}>Manage your account configuration and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        
        {/* Profile Section (Shared) */}
        <div className="card shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <User size={20} className="text-indigo-600" />
            <h3 style={{fontWeight: 700}}>Profile Information</h3>
          </div>
          <div className="form-group mb-3">
            <label className="form-label text-xs uppercase font-bold text-slate-400">Full Name</label>
            <input type="text" className="form-control" defaultValue={user.name || user.username || ''} />
          </div>
          <div className="form-group">
            <label className="form-label text-xs uppercase font-bold text-slate-400">Email Address (Read Only)</label>
            <input type="email" className="form-control bg-slate-50" value={user.sub} readOnly />
          </div>
          <button className="btn btn-primary mt-3 btn-sm">Save Changes</button>
        </div>

        {/* Security Section (Shared) */}
        <div className="card shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Lock size={20} className="text-indigo-600" />
            <h3 style={{fontWeight: 700}}>Security</h3>
          </div>
          <div className="form-group mb-3">
            <label className="form-label text-xs uppercase font-bold text-slate-400">Current Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label text-xs uppercase font-bold text-slate-400">New Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <button className="btn btn-outline-primary mt-3 btn-sm">Update Password</button>
        </div>
      </div>

      {/* APPLICANT ROLE VIEW */}
      {user.role === 'ROLE_APPLICANT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          
          {/* Documents Section */}
          <div className="card shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <FileText size={20} className="text-indigo-600" />
              <h3 style={{fontWeight: 700}}>My Documents</h3>
            </div>
            {loading ? (
              <div className="text-center py-4"><span className="spinner"></span></div>
            ) : docs.length > 0 ? (
              <div className="table-container">
                <table className="modern-table">
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{fontWeight: 600}}>{doc.documentType || 'Document'}</div>
                          <div className="text-secondary" style={{fontSize: '0.75rem'}}>Uploaded: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</div>
                        </td>
                        <td style={{textAlign: 'right'}}>
                          {doc.fileUrl ? (
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-link text-xs font-bold">View</a>
                          ) : (
                            <span className="text-secondary text-xs">No File</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-secondary text-sm">No documents found.</p>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="card shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <PrefIcon size={20} className="text-indigo-600" />
              <h3 style={{fontWeight: 700}}>Application Preferences</h3>
            </div>
            <div className="form-group mb-3">
              <label className="form-label text-xs uppercase font-bold text-slate-400">Employment Type</label>
              <select className="form-control">
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Business Owner</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label className="form-label text-xs uppercase font-bold text-slate-400">Communication Preference</label>
              <select className="form-control">
                <option>Email</option>
                <option>SMS</option>
                <option>Both</option>
              </select>
            </div>
            <button className="btn btn-outline-primary mt-2 btn-sm">Save Preferences</button>
          </div>
        </div>
      )}

      {/* ADMIN ROLE VIEW */}
      {user.role === 'ROLE_ADMIN' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          
          {/* System Overview */}
          <div className="card shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Database size={20} className="text-indigo-600" />
              <h3 style={{fontWeight: 700}}>System Overview</h3>
            </div>
            {loading ? (
              <div className="text-center py-4"><span className="spinner"></span></div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Users</p>
                  <p className="text-2xl font-black text-indigo-600">{stats.totalUsers || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase">Applications</p>
                  <p className="text-2xl font-black text-indigo-600">{stats.totalApplications || 0}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase">Approved</p>
                  <p className="text-2xl font-black text-emerald-700">{stats.approvedApplications || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-xs font-bold text-red-600 uppercase">Rejected</p>
                  <p className="text-2xl font-black text-red-700">{stats.rejectedApplications || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-secondary text-sm text-center py-4">Stats temporarily unavailable.</p>
            )}
          </div>

          {/* User Management */}
          <div className="card shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Users size={20} className="text-indigo-600" />
              <h3 style={{fontWeight: 700}}>User Management</h3>
            </div>
            <p className="text-secondary text-sm mb-4">View-only list of active system participants.</p>
            <div className="table-container">
              <table className="modern-table">
                <tbody>
                  <tr>
                    <td>
                      <div style={{fontWeight: 600}}>System Administrator</div>
                      <div className="text-secondary" style={{fontSize: '0.75rem'}}>Access Level: Root</div>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <span className="status-badge-compact status-approved">ACTIVE</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Logout Action (Shared) */}
      <div className="card shadow-sm" style={{ borderLeft: '4px solid #ef4444' }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 style={{fontWeight: 700, color: '#0f172a'}} className="flex items-center gap-2">
              <Shield size={20} className="text-red-500" /> Session Management
            </h3>
            <p className="text-secondary text-sm mt-1">Safely terminate your current session and clear local data.</p>
          </div>
          <button 
            className="btn shadow-sm flex items-center gap-2" 
            style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', fontWeight: 800 }}
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout Securely
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Settings;
