import { axiosClient } from '../AxiosClient/axios';

export const createAdventure = async (data) => {
  const res = await axiosClient.post('/api/adventure/create', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

export const fetchAllAdventures = async ({
  page = 1,
  limit = 10,
  search = '',
  location = '',
  date = '',
  adventure = '',
} = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search && search.trim() !== '') params.append('search', search);
  if (location && location.trim() !== '') params.append('location', location);
  if (date && date.trim() !== '') params.append('date', date);
  if (adventure && adventure.trim() !== '')
    params.append('adventure', adventure);
  console.log(params.toString());
  const res = await axiosClient.get(`/api/adventure/all?${params.toString()}`);
  return res;
};

export const fetchFilteredAdventures = async ({
  adventure = '',
  location = '',
  session_date = '',
} = {}) => {
  const params = new URLSearchParams();
  if (adventure && adventure.trim() !== '') params.append('adventure', adventure);
  if (location && location.trim() !== '') params.append('location', location);
  if (session_date && session_date.trim() !== '') params.append('session_date', session_date);
  const res = await axiosClient.get(`/api/adventure/filter?${params.toString()}`);
  return res;
};

export const updateAdventure = async (data) => {
  console.log(data);
  const id = data.get('_id');
  const res = await axiosClient.put(`/api/adventure/${id}`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

export const deleteAdventure = async (id) => {
  const res = await axiosClient.delete(`/api/adventure/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const getAdventure = async (id) => {
  const res = await axiosClient.get(`/api/adventure/${id}`);
  return res;
};
