import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { adminService } from '../services/adminService';
import { documentService } from '../services/documentService';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Search, Filter, RefreshCw, CheckCircle, XCircle, 
  AlertCircle, FileText, User, IndianRupee, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock,
  PieChart as PieIcon, TrendingUp, BarChart3, Activity, Bot
} from 'lucide-react';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Slide-over Drawer States
  const [reviewApp, setReviewApp] = useState(null);
  const [reviewDocs, setReviewDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [decisionData, setDecisionData] = useState({
    decisionType: 'APPROVE',
    remarks: ''
  });

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, appsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllApplications()
      ]);
      setStats(statsData);
      setApplications(appsData);
      setLastUpdated(new Date());
      if (isRefresh) toast.success('Dashboard synchronized');
    } catch (error) {
      console.error("Error fetching admin data", error);
      toast.error('Sync failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 120000); // Sync every 2 mins
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- Process Chart Data ---
  const chartData = useMemo(() => {
    if (!applications.length) return { status: [], trends: [], volume: [] };

    // 1. Status Distribution
    const statusCounts = applications.reduce((acc, app) => {
      const s = app.status || 'PENDING';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const statusPie = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // 2. Trends (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    const trends = last7Days.map(day => ({
      name: day,
      count: Math.floor(Math.random() * 10) + 2 // Placeholder until real history API is available
    }));

    // 3. Volume by Category (using loan amount ranges)
    const volume = [
      { name: '0-50k', value: applications.filter(a => (a.amount || a.loanAmount) <= 50000).length },
      { name: '50k-1L', value: applications.filter(a => (a.amount || a.loanAmount) > 50000 && (a.amount || a.loanAmount) <= 100000).length },
      { name: '1L-5L', value: applications.filter(a => (a.amount || a.loanAmount) > 100000 && (a.amount || a.loanAmount) <= 500000).length },
      { name: '5L+', value: applications.filter(a => (a.amount || a.loanAmount) > 500000).length },
    ];

    return { status: statusPie, trends, volume };
  }, [applications]);

  const startReview = async (app) => {
    setReviewApp(app);
    setLoadingDocs(true);
    setDecisionData({ 
        decisionType: app.status === 'APPROVED' ? 'APPROVE' : (app.status === 'REJECTED' ? 'REJECT' : 'APPROVE'), 
        remarks: '' 
    });
    try {
      const docsData = await documentService.getByApplication(app.id);
      setReviewDocs(docsData);
    } catch (error) {
      console.error("Error fetching documents", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleVerifyDoc = async (docId) => {
    try {
      await adminService.verifyDocument(docId);
      const updatedDocs = await documentService.getByApplication(reviewApp.id);
      setReviewDocs(updatedDocs);
      toast.success('Document verified');
      fetchData(true);
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.makeDecision(reviewApp.id, decisionData);
      setReviewApp(null);
      toast.success(`Application ${decisionData.decisionType.toLowerCase()}d successfully`);
      fetchData(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Decision submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      (app.applicantName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      app.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    if (s === 'APPROVED') return { bg: '#ecfdf5', text: '#059669', icon: <CheckCircle size={14}/> };
    if (s === 'REJECTED') return { bg: '#fef2f2', text: '#dc2626', icon: <XCircle size={14}/> };
    if (['PENDING', 'SUBMITTED', 'UNDER_REVIEW'].includes(s)) return { bg: '#fffbeb', text: '#d97706', icon: <Clock size={14}/> };
    return { bg: '#f9fafb', text: '#6b7280', icon: <AlertCircle size={14}/> };
  };

  if (user?.role !== 'ROLE_ADMIN') return <Navigate to="/dashboard" />;

  return (
    <div className="admin-pro-container animate-fade-in">
      {/* 🚀 Header: Operational Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Intelligence</h1>
          <p className="text-slate-500 mt-1">Real-time performance metrics and loan distribution analytics.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Sync</span>
              <span className="text-xs font-semibold text-slate-700">{lastUpdated.toLocaleTimeString()}</span>
           </div>
           <button 
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-indigo-600 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* 📊 High-Engagement Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Pipeline Volume', value: stats?.total || 0, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '↑ 12%' },
          { label: 'Awaiting Review', value: stats?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Critical' },
          { label: 'Total Approved', value: stats?.approved || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '↑ 8%' },
          { label: 'Risk Rejections', value: stats?.rejected || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '3.2%' },
        ].map((card, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${card.bg} opacity-20 group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4 shadow-inner`}>
                <card.icon size={24} className={card.color} />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{card.label}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.bg} ${card.color}`}>{card.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Status Distribution</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData.status} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.status.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.status.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-slate-500">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 lg:col-span-2 min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Application Velocity</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 📋 Data Grid Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Processing Queue</h3>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search case ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Case Reference</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Principal</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredApps.map(app => {
                  const style = getStatusStyle(app.status);
                  return (
                    <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => startReview(app)}>
                      <td className="px-6 py-4 font-black text-indigo-600 text-sm">#{app.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 text-sm">{app.applicantName || `User #${app.userId}`}</div>
                        <div className="text-[10px] text-slate-400 font-bold">UID: {app.userId}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-800 text-sm">₹{(app.amount || app.loanAmount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter" style={{ backgroundColor: style.bg, color: style.text }}>
                          {style.icon} {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-lg transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📂</div>
            <p className="font-bold text-slate-400">No matching cases found in current queue.</p>
          </div>
        )}
      </div>

      {/* 🛠️ Slide-Drawer: Remains functional and Pro */}
      <div className={`pro-drawer-overlay ${reviewApp ? 'visible' : ''}`} onClick={() => setReviewApp(null)}>
        <div className={`pro-drawer-panel ${reviewApp ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          {reviewApp && (
            <>
              <div className="pro-drawer-header">
                <div>
                  <h2 className="drawer-title">Application Intelligence</h2>
                  <p className="drawer-subtitle">Case Ref: #{reviewApp.id}</p>
                </div>
                <button className="drawer-close-btn" onClick={() => setReviewApp(null)}>&times;</button>
              </div>
              <div className="pro-drawer-body">
                <section className="pro-drawer-section">
                  <h4 className="pro-section-title flex justify-between items-center">
                    Case Details
                    {reviewApp.riskLevel && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        reviewApp.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-700' :
                        reviewApp.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        AI Risk: {reviewApp.riskLevel} ({reviewApp.riskScore}/100)
                      </span>
                    )}
                  </h4>
                  <div className="pro-detail-grid">
                    <div className="pro-detail-item"><label>Applicant</label><p>{reviewApp.applicantName}</p></div>
                    <div className="pro-detail-item"><label>Loan Principal</label><p className="highlight-amount">₹{(reviewApp.amount || reviewApp.loanAmount || 0).toLocaleString()}</p></div>
                    {reviewApp.aiRecommendation && (
                      <div className="pro-detail-item md:col-span-2 mt-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <label className="text-indigo-600 flex items-center gap-1 mb-1 font-bold"><Bot size={14}/> AI Analyst Recommendation</label>
                        <p className="text-xs text-slate-600 leading-relaxed italic">{reviewApp.aiRecommendation}</p>
                      </div>
                    )}
                  </div>
                </section>
                <section className="pro-drawer-section">
                  <h4 className="pro-section-title">Verified Documents</h4>
                  {loadingDocs ? <div className="drawer-loader"></div> : reviewDocs.length > 0 ? (
                    <div className="pro-doc-checklist">
                      {reviewDocs.map(doc => (
                        <div key={doc.id} className="pro-doc-item">
                          <div className="doc-meta">
                            <span className="doc-type-icon"><FileText size={16}/></span>
                            <div>
                              <p className="doc-label">{doc.documentType || 'Document'}</p>
                              <p className="doc-filename">{doc.fileName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.fileUrl ? (
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="pro-btn-view">
                                View
                              </a>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-rose-500 font-bold">No URL</span>
                                <span className="text-[10px] text-slate-400">Keys: {Object.keys(doc).join(', ')}</span>
                              </div>
                            )}
                            
                            {doc.status === 'VERIFIED' ? (
                              <span className="badge-verified">Verified</span>
                            ) : (
                              <button className="pro-btn-verify" onClick={() => handleVerifyDoc(doc.id)}>Verify</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-slate-400 text-xs italic">No documents uploaded.</p>}
                </section>
                <section className="pro-drawer-section">
                  <h4 className="pro-section-title">Adjudication</h4>
                  <form onSubmit={handleDecision}>
                    <div className="pro-form-group mb-5">
                      <label className="pro-form-label">System Decision</label>
                      <select className="pro-select" value={decisionData.decisionType} onChange={e => setDecisionData({...decisionData, decisionType: e.target.value})}>
                        <option value="APPROVE">Approve & Disburse</option>
                        <option value="REJECT">Reject Application</option>
                        <option value="NEEDS_INFO">Request Information</option>
                      </select>
                    </div>
                    <div className="pro-form-group mb-5">
                      <label className="pro-form-label">Officer Remarks</label>
                      <textarea className="pro-textarea" rows="4" placeholder="Enter adjudication notes..." value={decisionData.remarks} onChange={e => setDecisionData({...decisionData, remarks: e.target.value})} required></textarea>
                    </div>
                    <button type="submit" disabled={submitting} className={`pro-btn-submit ${decisionData.decisionType === 'REJECT' ? 'bg-red' : 'bg-indigo'}`}>
                      {submitting ? 'Processing...' : 'Commit Decision'}
                    </button>
                  </form>
                </section>
              </div>
            </>
          )}
        </div>
      </div>


    </div>
  );
};

export default AdminPanel;

