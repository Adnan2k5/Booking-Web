import { axiosClient } from '../AxiosClient/axios';

export const fetchUsers = async ({
  search = '',
  role = 'all',
  page = 1,
  limit = 10,
}) => {
  const params = { search, role, page, limit };
  const { data } = await axiosClient.get('/api/user', { params });
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await axiosClient.delete(`/api/user/${userId}`);
  return data;
};

export const getUserAdventures = async () => {
  const { data } = await axiosClient.get('/api/user/adventure', {
    withCredentials: true,
  });
  return data;
};

export const getUserAdventureExperiences = async () => {
  const { data } = await axiosClient.get('/api/user/adventure-experiences', {
    withCredentials: true,
  });
  return data;
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/user/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch current user:", error.response?.data || error.message);
    throw new Error("Unable to retrieve user information");
  }
};

