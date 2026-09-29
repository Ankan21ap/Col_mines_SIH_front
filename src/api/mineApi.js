import axiosClient from './axiosClient'

export const mineApi = {
  getAll:  (params) => axiosClient.get('/mines', { params }),
  getById: (id)     => axiosClient.get(`/mines/${id}`),
  create:  (data)   => axiosClient.post('/mines', data),
  update:  (id, data) => axiosClient.put(`/mines/${id}`, data),
  delete:  (id)     => axiosClient.delete(`/mines/${id}`),
}
