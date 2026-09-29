import axiosClient from './axiosClient'

export const userApi = {
  getAll:            (params) => axiosClient.get('/users', { params }),
  getById:           (id)     => axiosClient.get(`/users/${id}`),
  create:            (data)   => axiosClient.post('/users', data),
  update:            (id, data) => axiosClient.put(`/users/${id}`, data),
  delete:            (id)     => axiosClient.delete(`/users/${id}`),
  updateStatus:      (id, status) => axiosClient.patch(`/users/${id}/status`, { status }),
  updatePermissions: (id, data)   => axiosClient.patch(`/users/${id}/permissions`, data),
}
