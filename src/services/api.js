import axios from 'axios';

// Substitua pelo IP da sua máquina se estiver testando em um dispositivo físico
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const bookService = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export default api;
