import api from './api';

export const documentService = {
  // POST http://localhost:9002/gateway/documents/upload (multipart/form-data)
  upload: async (formData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // POST http://localhost:9002/gateway/documents/verify/{id}
  verify: async (id) => {
    const response = await api.post(`/documents/verify/${id}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents/my
  getMyDocuments: async () => {
    const response = await api.get('/documents/my');
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents/{id}
  getById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents/application/{appId}
  getByApplication: async (appId) => {
    const response = await api.get(`/documents/application/${appId}`);
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents/verified
  getVerified: async () => {
    const response = await api.get('/documents/verified');
    return response.data;
  },

  // GET http://localhost:9002/gateway/documents/pending
  getPending: async () => {
    const response = await api.get('/documents/pending');
    return response.data;
  },

  // DELETE http://localhost:9002/gateway/documents/{id}
  delete: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};
