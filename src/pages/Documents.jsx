import React, { useState, useEffect, useContext } from 'react';
import { documentService } from '../services/documentService';
import { applicationService } from '../services/applicationService';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';

const Documents = () => {
  const { user } = useContext(AuthContext);

  // Guard: Admins should not be here
  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [uploadData, setUploadData] = useState({
    applicationId: '',
    documentType: 'IDENTITY',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch documents
      const docsData = await documentService.getAll();
      setDocuments(docsData);

      // Fetch applications for the dropdown
      const appsData = await applicationService.getMyApplications();
      setApplications(appsData);
    } catch (error) {
      console.error("Error fetching documents data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.applicationId) return;

    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('applicationId', uploadData.applicationId);
    formData.append('documentType', uploadData.documentType);

    try {
      await documentService.upload(formData);
      setUploadData({ ...uploadData, file: null });
      fetchData();
    } catch (error) {
      console.error("Error uploading document", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await documentService.verify(id);
      fetchData();
    } catch (error) {
      console.error("Error verifying document", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2>Documents</h2>
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="card">
            <h3 style={{marginBottom: '1rem', color: 'var(--primary-navy)'}}>Uploaded Documents</h3>
            {loading ? (
              <div className="text-center py-4"><span className="spinner"></span></div>
            ) : documents.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>App ID</th>
                      <th>Type</th>
                      <th>File Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td>#{doc.id}</td>
                        <td>App #{doc.applicationId}</td>
                        <td>{doc.documentType}</td>
                        <td style={{fontWeight: 500}}>
                          {doc.fileName}
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{marginLeft: '8px', fontSize: '0.75rem', color: 'var(--primary-indigo)'}}>
                            (View)
                          </a>
                        </td>
                        <td>
                          <span className={`status-badge ${doc.status === 'VERIFIED' ? 'status-approved' : 'status-pending'}`}>
                            {doc.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-secondary">
                No documents found.
              </div>
            )}
          </div>
        </div>

        <div className="side-col">
          <div className="card">
            <h3 style={{marginBottom: '1.5rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Upload size={18} /> Upload Document
            </h3>
            
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Application</label>
                <select 
                  className="form-control" 
                  value={uploadData.applicationId}
                  onChange={e => setUploadData({...uploadData, applicationId: e.target.value})}
                  required
                >
                  <option value="">Select Application</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.applicantName} (App #{app.id})</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Document Type</label>
                <select 
                  className="form-control"
                  value={uploadData.documentType}
                  onChange={e => setUploadData({...uploadData, documentType: e.target.value})}
                  required
                >
                  <option value="IDENTITY">Identity Proof</option>
                  <option value="ADDRESS">Address Proof</option>
                  <option value="INCOME">Income Proof</option>
                  <option value="BANK_STATEMENT">Bank Statement</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">File</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleFileChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full mt-4">
                Upload Document
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documents;
