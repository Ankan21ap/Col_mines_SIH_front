import axiosClient from './axiosClient'

export const actionApi = {
  getAll:   (params) => axiosClient.get('/actions', { params }),
  getById:  (id)     => axiosClient.get(`/actions/${id}`),
  create:   (data)   => axiosClient.post('/actions', data),
  update:   (id, data) => axiosClient.put(`/actions/${id}`, data),
  approve:  (id, data) => axiosClient.patch(`/actions/${id}/approve`, data),
}
