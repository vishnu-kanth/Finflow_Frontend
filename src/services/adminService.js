import api from './api';

export const adminService = {
  // GET http://localhost:9002/gateway/admin/stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // GET http://localhost:9002/gateway/admin/applications
  getAllApplications: async () => {
    const response = await api.get('/admin/applications');
    return response.data;
  },

  // GET http://localhost:9002/gateway/admin/applications/{id}
  getApplicationById: async (id) => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/admin/applications/status/{status}
  getApplicationsByStatus: async (status) => {
    const response = await api.get(`/admin/applications/status/${status}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/admin/decisions
  getAllDecisions: async () => {
    const response = await api.get('/admin/decisions');
    return response.data;
  },

  // GET http://localhost:9002/gateway/admin/decision/application/{appId}
  getDecisionByApplication: async (appId) => {
    const response = await api.get(`/admin/decision/application/${appId}`);
    return response.data;
  },

  // POST http://localhost:9002/documents/verify/{id} (admin only)
  verifyDocument: async (docId) => {
    const response = await api.post(`/documents/verify/${docId}`);
    return response.data;
  },

  // POST http://localhost:9002/gateway/admin/applications/{id}/decision
  makeDecision: async (appId, decisionData) => {
    // ✅ Add Debug Logging
    console.log("Decision Payload:", decisionData);

    // Send clean payload matching DecisionRequest DTO
    const payload = {
      decisionType: decisionData.decisionType,
      remarks: decisionData.remarks
    };
    const response = await api.post(`/admin/applications/${appId}/decision`, payload);
    return response.data;
  },

  // POST http://localhost:9002/gateway/admin/decision
  createDecision: async (decisionData) => {
    const response = await api.post('/admin/decision', decisionData);
    return response.data;
  },

  // PUT http://localhost:9002/gateway/admin/decision/{id}
  updateDecision: async (id, decisionData) => {
    const response = await api.put(`/admin/decision/${id}`, decisionData);
    return response.data;
  },

  // DELETE http://localhost:9002/gateway/admin/decision/{id}
  deleteDecision: async (id) => {
    const response = await api.delete(`/admin/decision/${id}`);
    return response.data;
  },
};
