import { axiosClient } from '../AxiosClient/axios';

export const createPreset = async (data) => {
  try {
    const res = await axiosClient.post('/api/session/preset', data, {
      withCredentials: true,
    });

    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createSession = async (data) => {
  try {
    const res = await axiosClient.post('/api/session', data, {
      withCredentials: true,
    });

    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};  

export const getAllSessions = async (id) => {
  const res = await axiosClient.get(`/api/session/${id}`, {
    withCredentials: true,
  });
  if (res.status === 200) {
    return res;
  }
};

export const deleteSession = async (id) => {
  
}
