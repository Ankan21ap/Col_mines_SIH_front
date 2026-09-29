import axiosClient from './axiosClient'

export const violationApi = {
  getAll:  (params) => axiosClient.get('/violations', { params }),
  getById: (id)     => axiosClient.get(`/violations/${id}`),
  create:  (data)   => axiosClient.post('/violations', data),
  update:  (id, data) => axiosClient.put(`/violations/${id}`, data),
  verify:  (id, data) => axiosClient.patch(`/violations/${id}/verify`, data),
}
