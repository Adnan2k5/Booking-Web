import { axiosClient } from '../AxiosClient/axios';

export const createBooking = async (name) => {
  const res = await axiosClient.get(`/api/itemBooking/create?name=${name}`, {
    withCredentials: true,
  });
  return res;
};