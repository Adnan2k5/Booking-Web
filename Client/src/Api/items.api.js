import axiosClient from '../Middleware/AxiosClient';
export const fetchAllItems = async ({ search } = {}) => {
  const res = await axiosClient.get(`/api/item/discover`, {
    withCredentials: true,
    params: {
      search: search || 'all',
    },
  });
  return res;
};

export const createItems = async (data) => {
  const res = await axiosClient.post('/api/item/upload', data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteItem = async (id) => {
  const res = await axiosClient.delete(`/api/item/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateItem = async (id, data) => {
  const res = await axiosClient.put(`/api/item/${id}`, data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
};

export const postItemReview = async (data) => {
  const id = data.id;
  const res = await axiosClient.post(`/api/user/reviews/${id}`, data, {
    withCredentials: true,
  });
  if (res.status === 201) {
    return true;
  } else {
    return false;
  }
};

export const fetchTopReviewedItems = async () => {
  const res = await axiosClient.get('/api/item/top-reviewed', {
    withCredentials: true,
  });
  return res.data;
};
