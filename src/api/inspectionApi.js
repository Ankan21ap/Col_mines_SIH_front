import axiosClient from './axiosClient'

export const inspectionApi = {
  getAll:  (params) => axiosClient.get('/inspections', { params }),
  getById: (id)     => axiosClient.get(`/inspections/${id}`),
  create:  (data)   => axiosClient.post('/inspections', data),
  update:  (id, data) => axiosClient.put(`/inspections/${id}`, data),
  verify:  (id, data) => axiosClient.patch(`/inspections/${id}/verify`, data),
}
