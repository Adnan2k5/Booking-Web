import { axiosClient } from '../AxiosClient/axios.js';

export const verify = async (data) => {
  try {
    const res = await axiosClient.post('/api/hotel/verify', data, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};
export const registerHotel = async (data) => {
  try {
    const res = await axiosClient.post('/api/hotel/', data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getHotelByOwnerId = async (id) => {
  try {
    const res = await axiosClient.get(`/api/hotel/${id}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getHotel = async ({ search = '', page = 1, limit = 10 } = {}) => {
  try {
    const res = await axiosClient.get('/api/hotel', {
      params: { search, page, limit },
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const approve = async (id) => {
  try {
    const res = await axiosClient.put(`/api/hotel/approve/${id}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const reject = async (id) => {
  try {
    const res = await axiosClient.put(`/api/hotel/reject/${id}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};
