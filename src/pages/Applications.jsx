import React, { useState, useEffect, useContext } from 'react';
import { applicationService } from '../services/applicationService';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Applications = () => {
  const { user } = useContext(AuthContext);

  // Guard: Admins should not be here
  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    tenure: '',
    employmentType: 'SALARIED',
    monthlyIncome: '',
    panNumber: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Revert to getMyApplications() as it is the canonical way for applicants
      const data = await applicationService.getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applications", error);
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const idempotencyKey = crypto.randomUUID();
    console.log("[FRONTEND] Creating application with Idempotency-Key:", idempotencyKey);
    
    try {
      await applicationService.create({
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        tenure: parseInt(formData.tenure),
        employmentType: formData.employmentType,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        panNumber: formData.panNumber
      }, idempotencyKey);
      
      setShowCreateModal(false);
      fetchApplications();
      setFormData({ amount: '', purpose: '', tenure: '', employmentType: 'SALARIED', monthlyIncome: '', panNumber: '' });
    } catch (error) {
      console.error("Error creating application", error);
      alert(error.response?.data?.error || "Failed to create application. Check if you have an active loan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApp = async (id) => {
    try {
      await applicationService.submit(id);
      fetchApplications();
    } catch (error) {
      console.error("Error submitting application", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2>Applications</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} style={{marginRight: '8px'}} /> New Application
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-4"><span className="spinner"></span></div>
        ) : applications.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>₹{app.amount}</td>
                    <td>{app.purpose}</td>
                    <td>
                      <span className={`status-badge status-${app.status?.toLowerCase() || 'pending'}`}>
                        {app.status || 'DRAFT'}
                      </span>
                    </td>
                    <td>
                      {app.status === 'DRAFT' && user.role !== 'ADMIN' && (
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleSubmitApp(app.id)}
                          style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                        >
                          Submit
                        </button>
                      )}
                      <button className="btn btn-outline-light" style={{color: 'var(--primary-navy)', border: '1px solid var(--border-color)', marginLeft: '8px', fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-secondary">
            No applications found.
          </div>
        )}
      </div>

      {showCreateModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '1rem'}}>New Loan Application</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Loan Amount (₹)</label>
                <input required type="number" className="form-control" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Purpose</label>
                <input required type="text" className="form-control" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Tenure (Months)</label>
                <input required type="number" className="form-control" value={formData.tenure} onChange={e => setFormData({...formData, tenure: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select className="form-control" value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}>
                  <option value="SALARIED">Salaried</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Income (₹)</label>
                <input required type="number" className="form-control" value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input required type="text" className="form-control" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} />
              </div>
              <div className="flex gap-2 mt-4" style={{justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Applications;
