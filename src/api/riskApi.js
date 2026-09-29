import axiosClient from './axiosClient'

export const riskApi = {
  getAll:      (params) => axiosClient.get('/risk', { params }),
  getMineRisk: (mineId) => axiosClient.get(`/risk/mine/${mineId}`),
  compute:     (mineId) => axiosClient.post(`/risk/compute/${mineId}`),
  computeAll:  ()       => axiosClient.post('/risk/compute-all'),
}
