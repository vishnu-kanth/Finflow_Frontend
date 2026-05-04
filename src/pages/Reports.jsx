import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import {
  FileText, Download, RefreshCw, TrendingUp, DollarSign,
  Users, ShieldCheck, Clock, CheckCircle, XCircle, AlertTriangle,
  BarChart3, PieChart as PieIcon, Activity, Calendar, Bot
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsData, statsData, decisionsData] = await Promise.all([
          adminService.getAllApplications().catch(() => []),
          adminService.getStats().catch(() => null),
          adminService.getAllDecisions().catch(() => [])
        ]);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setStats(statsData);
        setDecisions(Array.isArray(decisionsData) ? decisionsData : []);
      } catch (err) {
        console.error('Reports fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const analytics = useMemo(() => {
    if (!applications.length) return null;

    // Status breakdown
    const statusMap = {};
    applications.forEach(a => {
      const s = a.status || 'UNKNOWN';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusPie = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // Amount distribution
    const amountBuckets = [
      { name: '₹0-50K', min: 0, max: 50000 },
      { name: '₹50K-1L', min: 50000, max: 100000 },
      { name: '₹1L-5L', min: 100000, max: 500000 },
      { name: '₹5L-10L', min: 500000, max: 1000000 },
      { name: '₹10L+', min: 1000000, max: Infinity }
    ];
    const amountDist = amountBuckets.map(b => ({
      name: b.name,
      count: applications.filter(a => {
        const amt = a.amount || a.loanAmount || 0;
        return amt > b.min && amt <= b.max;
      }).length
    }));

    // Employment breakdown
    const empMap = {};
    applications.forEach(a => {
      const e = a.employmentType || 'Unknown';
      empMap[e] = (empMap[e] || 0) + 1;
    });
    const empPie = Object.entries(empMap).map(([name, value]) => ({ name, value }));

    // Risk distribution
    const riskMap = { LOW: 0, MEDIUM: 0, HIGH: 0, 'N/A': 0 };
    applications.forEach(a => {
      const r = a.riskLevel || 'N/A';
      riskMap[r] = (riskMap[r] || 0) + 1;
    });
    const riskBar = Object.entries(riskMap).map(([name, value]) => ({ name, value }));

    // Monthly trend
    const monthMap = {};
    applications.forEach(a => {
      if (a.createdAt) {
        const d = new Date(a.createdAt);
        const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        monthMap[key] = (monthMap[key] || 0) + 1;
      }
    });
    const monthlyTrend = Object.entries(monthMap).map(([name, count]) => ({ name, count }));

    // KPIs
    const totalAmount = applications.reduce((s, a) => s + (a.amount || a.loanAmount || 0), 0);
    const avgAmount = applications.length ? totalAmount / applications.length : 0;
    const approvalRate = applications.length ? ((statusMap['APPROVED'] || 0) / applications.length * 100).toFixed(1) : 0;
    const avgRisk = applications.filter(a => a.riskScore != null).length > 0
      ? (applications.filter(a => a.riskScore != null).reduce((s, a) => s + a.riskScore, 0) / applications.filter(a => a.riskScore != null).length).toFixed(0)
      : 'N/A';

    return { statusPie, amountDist, empPie, riskBar, monthlyTrend, totalAmount, avgAmount, approvalRate, avgRisk };
  }, [applications]);

  if (user?.role !== 'ROLE_ADMIN') return <Navigate to="/dashboard" />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign size={16} /> },
    { id: 'risk', label: 'AI & Risk', icon: <Bot size={16} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={16} /> },
  ];

  const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' };
  const sectionTitle = (icon, title) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
      {icon}
      <h3 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e293b', margin: 0 }}>{title}</h3>
    </div>
  );

  return (
    <div className="dashboard-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)', margin: 0 }}>System Reports</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: '4px 0 0' }}>Comprehensive analytics and performance insights across the FinFlow platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
            backgroundColor: activeTab === tab.id ? 'var(--primary-navy)' : 'transparent',
            color: activeTab === tab.id ? '#fff' : '#64748b'
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner"></div>
        </div>
      ) : !analytics ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#94a3b8', fontWeight: 600 }}>No application data available for reports.</p>
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Cards */}
              <div className="stats-grid" style={{ marginBottom: '24px' }}>
                {[
                  { label: 'Total Applications', value: applications.length, icon: <FileText size={18} />, color: '#6366f1', bg: '#eef2ff' },
                  { label: 'Approval Rate', value: analytics.approvalRate + '%', icon: <CheckCircle size={18} />, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Avg Loan Amount', value: '₹' + Math.round(analytics.avgAmount).toLocaleString(), icon: <DollarSign size={18} />, color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'Avg AI Risk Score', value: analytics.avgRisk, icon: <ShieldCheck size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
                ].map((kpi, i) => (
                  <div key={i} className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ backgroundColor: kpi.bg, padding: '8px', borderRadius: '10px', display: 'flex', color: kpi.color }}>{kpi.icon}</div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>{kpi.label}</span>
                    </div>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                <div style={cardStyle}>
                  {sectionTitle(<PieIcon size={16} color="#6366f1" />, 'Status Distribution')}
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics.statusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                          {analytics.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={cardStyle}>
                  {sectionTitle(<TrendingUp size={16} color="#6366f1" />, 'Monthly Application Trend')}
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.monthlyTrend}>
                        <defs>
                          <linearGradient id="gradReport" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#gradReport)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* FINANCIAL TAB */}
          {activeTab === 'financial' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="stat-card">
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Total Pipeline Value</span>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>₹{analytics.totalAmount.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Average Loan Size</span>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>₹{Math.round(analytics.avgAmount).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={cardStyle}>
                  {sectionTitle(<BarChart3 size={16} color="#6366f1" />, 'Loan Amount Distribution')}
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.amountDist}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={cardStyle}>
                  {sectionTitle(<Users size={16} color="#10b981" />, 'Employment Type Breakdown')}
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analytics.empPie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {analytics.empPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* AI & RISK TAB */}
          {activeTab === 'risk' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {[
                  { label: 'Low Risk', value: applications.filter(a => a.riskLevel === 'LOW').length, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Medium Risk', value: applications.filter(a => a.riskLevel === 'MEDIUM').length, color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'High Risk', value: applications.filter(a => a.riskLevel === 'HIGH').length, color: '#ef4444', bg: '#fef2f2' },
                ].map((item, i) => (
                  <div key={i} className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>{item.label}</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: item.color, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={cardStyle}>
                  {sectionTitle(<Bot size={16} color="#8b5cf6" />, 'AI Risk Level Distribution')}
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.riskBar}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {analytics.riskBar.map((entry, i) => (
                            <Cell key={i} fill={entry.name === 'LOW' ? '#10b981' : entry.name === 'MEDIUM' ? '#f59e0b' : entry.name === 'HIGH' ? '#ef4444' : '#94a3b8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={cardStyle}>
                  {sectionTitle(<ShieldCheck size={16} color="#8b5cf6" />, 'AI Recommendations Summary')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['APPROVE', 'REVIEW', 'REJECT'].map(rec => {
                      const count = applications.filter(a => a.aiRecommendation === rec).length;
                      const pct = applications.length ? (count / applications.length * 100).toFixed(1) : 0;
                      return (
                        <div key={rec} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '70px', color: '#475569' }}>{rec}</span>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: pct + '%', height: '100%', borderRadius: '4px', backgroundColor: rec === 'APPROVE' ? '#10b981' : rec === 'REVIEW' ? '#f59e0b' : '#ef4444', transition: 'width 0.5s' }}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', width: '50px', textAlign: 'right' }}>{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic' }}>
                      AI analysis powered by Google Gemini 2.5 Flash. Recommendations are advisory only.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div style={cardStyle}>
              {sectionTitle(<FileText size={16} color="#6366f1" />, `All Applications (${applications.length})`)}
              <div style={{ overflowX: 'auto' }}>
                <table className="modern-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Applicant</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Risk</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>AI Rec.</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', textAlign: 'left' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => {
                      const statusColors = { APPROVED: '#10b981', REJECTED: '#ef4444', SUBMITTED: '#f59e0b', DRAFT: '#94a3b8' };
                      const riskColors = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#6366f1', fontSize: '0.85rem' }}>#{app.id}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>{app.applicantName || app.email || `User #${app.userId}`}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem' }}>₹{(app.amount || 0).toLocaleString()}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, color: statusColors[app.status] || '#64748b', backgroundColor: (statusColors[app.status] || '#64748b') + '15' }}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: riskColors[app.riskLevel] || '#94a3b8' }}>
                              {app.riskLevel || '—'} {app.riskScore != null ? `(${app.riskScore})` : ''}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>{app.aiRecommendation || '—'}</td>
                          <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#94a3b8' }}>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
