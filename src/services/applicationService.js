import api from './api';

export const applicationService = {
  // GET http://localhost:9002/gateway/applications
  getAll: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  // GET http://localhost:9002/gateway/applications/{id}
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/applications/my
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  // ⚠️ DEPRECATED: Use getMyApplications() for isolated access
  // GET http://localhost:9002/gateway/applications/user/{userId}
  getByUser: async (userId) => {
    const response = await api.get(`/applications/user/${userId}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/applications/status/{status}
  getByStatus: async (status) => {
    const response = await api.get(`/applications/status/${status}`);
    return response.data;
  },

  // POST http://localhost:9002/gateway/applications
  create: async (applicationData, idempotencyKey) => {
    const response = await api.post('/applications', applicationData, {
      headers: {
        'Idempotency-Key': idempotencyKey
      }
    });
    return response.data;
  },

  // PUT http://localhost:9002/gateway/applications/{id}
  update: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  // PATCH http://localhost:9002/gateway/applications/{id}/submit
  submit: async (id) => {
    const response = await api.patch(`/applications/${id}/submit`);
    return response.data;
  },

  // PATCH http://localhost:9002/gateway/applications/{id}/approve
  approve: async (id) => {
    const response = await api.patch(`/applications/${id}/approve`);
    return response.data;
  },

  // PATCH http://localhost:9002/gateway/applications/{id}/reject
  reject: async (id) => {
    const response = await api.patch(`/applications/${id}/reject`);
    return response.data;
  },

  // PATCH http://localhost:9002/gateway/applications/{id}/cancel
  cancel: async (id) => {
    const response = await api.patch(`/applications/${id}/cancel`);
    return response.data;
  },

  // PATCH http://localhost:9002/gateway/applications/{id}/request-info
  requestInfo: async (id) => {
    const response = await api.patch(`/applications/${id}/request-info`);
    return response.data;
  },
};
