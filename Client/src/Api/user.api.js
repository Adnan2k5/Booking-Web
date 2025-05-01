import { axiosClient } from '../AxiosClient/axios';

// Fetch users with pagination, search, and role filter
export const fetchUsers = async ({ search = '', role = 'all', page = 1, limit = 10 }) => {
  const params = { search, role, page, limit };
  const { data } = await axiosClient.get('/api/user', { params });
  return data;
};
