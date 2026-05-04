import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { useNavigate, Navigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, FileText, HelpCircle, Bot } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Guard for Admin
  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const apps = await applicationService.getMyApplications();
        
        if (Array.isArray(apps)) {
          const calculatedStats = {
            total: apps.length,
            pending: apps.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'PENDING'].includes(a?.status)).length,
            approved: apps.filter(a => a?.status === 'APPROVED').length,
            rejected: apps.filter(a => a?.status === 'REJECTED').length
          };
          setStats(calculatedStats);
          setRecentApps(apps.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const getStatusDetails = (status) => {
    switch(status?.toUpperCase()) {
      case 'APPROVED': return { class: 'status-approved', icon: <CheckCircle size={16}/>, label: 'Approved' };
      case 'REJECTED': return { class: 'status-rejected', icon: <XCircle size={16}/>, label: 'Rejected' };
      case 'SUBMITTED': case 'UNDER_REVIEW': return { class: 'status-submitted', icon: <Clock size={16}/>, label: 'In Review' };
      default: return { class: 'status-pending', icon: <AlertCircle size={16}/>, label: 'Action Required' };
    }
  };

  const latestApp = recentApps[0] || null;

  return (
    <div className="dashboard-wrapper">
      {/* Dynamic Status Alert */}
      {latestApp && (
        <div className={`status-alert-banner mb-4 ${getStatusDetails(latestApp.status).class}`}>
          <div className="flex items-center gap-3">
            {getStatusDetails(latestApp.status).icon}
            <div>
              <p className="alert-title">Latest Status: {latestApp.status}</p>
              <p className="alert-desc">Your application #{latestApp.id} was last updated on {latestApp.updatedAt ? new Date(latestApp.updatedAt).toLocaleDateString() : 'recently'}.</p>
            </div>
          </div>
          {latestApp.status === 'NEEDS_INFO' && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/applications/${latestApp.id}`)}>Fix Issues</button>
          )}
        </div>
      )}

      <div className="hero-banner mb-5">
        <div>
          <h1 style={{fontSize: '2rem', fontWeight: 800}}>Welcome back, {user?.name || user?.username || 'Applicant'}</h1>
          <p className="text-secondary" style={{fontSize: '1.1rem'}}>You have {stats.pending} application(s) currently being processed by our team.</p>
        </div>
        <button className="btn btn-primary shadow-lg" onClick={() => navigate('/applications')} style={{padding: '0.8rem 1.5rem', borderRadius: '12px'}}>
          <Plus size={20} style={{marginRight: '8px'}} /> Create New Application
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          {/* Quick Stats Grid - Refactored to horizontal responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="stat-card p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Active Loans</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="stat-card p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Clock size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing</span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">In Review</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.pending}</h3>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="stat-card p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successful</span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Approved</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.approved}</h3>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{color: 'var(--primary-navy)', fontWeight: 700}}>Recent Submissions</h3>
              <button className="text-link" onClick={() => navigate('/applications')}>View All</button>
            </div>
            
            {loading ? (
              <div className="text-center py-5"><span className="spinner"></span></div>
            ) : recentApps.length > 0 ? (
              <div className="table-container">
                <table className="modern-table">
                  <tbody>
                    {recentApps.map(app => (
                      <tr key={app?.id}>
                        <td style={{width: '40px'}}><div className="icon-circle"><FileText size={18}/></div></td>
                        <td>
                          <div style={{fontWeight: 700}}>₹{(app?.amount || app?.loanAmount || 0).toLocaleString()}</div>
                          <div className="text-secondary" style={{fontSize: '0.75rem'}}>ID: #{app?.id}</div>
                        </td>
                        <td>
                          <div style={{fontSize: '0.85rem', fontWeight: 600}}>{app?.applicantName || 'Loan Request'}</div>
                          <div className="text-secondary" style={{fontSize: '0.75rem'}}>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}</div>
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <span className={`status-badge-compact ${getStatusDetails(app?.status).class}`}>
                            {app?.status || 'DRAFT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state py-5 text-center">
                <p className="text-secondary">Ready to start your financial journey?</p>
                <button className="btn btn-outline-primary mt-2" onClick={() => navigate('/applications')}>Submit First Request</button>
              </div>
            )}
          </div>
        </div>

        <div className="side-col">
          {/* Tracking Timeline */}
          <div className="card shadow-sm h-full" style={{borderTop: '4px solid var(--primary-navy)'}}>
            <h3 className="mb-4" style={{fontSize: '1.1rem', fontWeight: 700}}>Live Status Tracking</h3>
            
            {latestApp ? (
              <div className="vertical-timeline">
                <div className="timeline-step completed">
                  <div className="step-marker"><CheckCircle size={14}/></div>
                  <div className="step-info">
                    <h4>Application Initiated</h4>
                    <p>Details successfully captured</p>
                  </div>
                </div>

                <div className={`timeline-step ${latestApp.status !== 'DRAFT' ? 'completed' : 'active'}`}>
                  <div className="step-marker">{latestApp.status !== 'DRAFT' ? <CheckCircle size={14}/> : <Clock size={14}/>}</div>
                  <div className="step-info">
                    <h4>Document Review</h4>
                    <p>{['SUBMITTED', 'DRAFT'].includes(latestApp.status) ? 'Awaiting verification' : 'Verified & Validated'}</p>
                  </div>
                </div>

                <div className={`timeline-step ${['APPROVED', 'REJECTED'].includes(latestApp.status) ? 'completed' : (latestApp.status !== 'DRAFT' ? 'active' : '')}`}>
                  <div className="step-marker">{['APPROVED', 'REJECTED'].includes(latestApp.status) ? <CheckCircle size={14}/> : <Clock size={14}/>}</div>
                  <div className="step-info">
                    <h4>Administrative Decision</h4>
                    <p>{['APPROVED', 'REJECTED'].includes(latestApp.status) ? 'Final decision reached' : 'Under final assessment'}</p>
                    {latestApp.adminRemarks && (
                      <div className="remarks-bubble mt-2">
                        <p>"{latestApp.adminRemarks}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <HelpCircle className="mx-auto mb-2 text-secondary" size={32}/>
                <p className="text-secondary" style={{fontSize: '0.85rem'}}>Submit an application to see your real-time tracking timeline.</p>
              </div>
            )}

            {latestApp?.aiRecommendation && (
              <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 text-indigo-700" style={{fontSize: '0.9rem', fontWeight: 700}}>
                  <Bot size={16} /> AI Assistant Insight
                </h3>
                <p className="text-slate-600 italic leading-relaxed" style={{fontSize: '0.85rem'}}>
                  "{latestApp.aiRecommendation}"
                </p>
              </div>
            )}

            <div className="resource-footer mt-5 p-3 rounded bg-light">
              <p style={{fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8'}}>Support Resources</p>
              <ul className="list-unstyled mt-2">
                <li style={{fontSize: '0.85rem', marginBottom: '8px'}}><a href="#" className="text-secondary hover-primary">Need help with documents?</a></li>
                <li style={{fontSize: '0.85rem'}}><a href="#" className="text-secondary hover-primary">Understand our criteria</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
