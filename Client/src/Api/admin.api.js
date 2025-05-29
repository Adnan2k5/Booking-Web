import { axiosClient } from '../AxiosClient/axios';

export const createAdmin = async (adminData) => {
  const res = await axiosClient.post('/api/admin/create', adminData);
  return res.data;
};

export const fetchAdmins = async ({ search = '', page = 1, limit = 10 }) => {
  const params = { search, page, limit };
  const { data } = await axiosClient.get('/api/admin', { params });
  return data;
};

export const updateAdmin = async (adminData) => {
  const res = await axiosClient.put(`/api/admin/${adminData._id}`, adminData);
  return res.data;
};

export const deleteAdmin = async (adminId) => {
  const res = await axiosClient.delete(`/api/admin/${adminId}`);
  return res.data;
};
