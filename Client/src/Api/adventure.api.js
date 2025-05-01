import { axiosClient } from "../AxiosClient/axios";

export const createAdventure = async (data) => {
  const res = await axiosClient.post("/api/adventure/create", data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const fetchAllAdventures = async () => {
  const res = await axiosClient.get("/api/adventure/all");
  return res;
};

export const updateAdventure = async (data) => {
  console.log(data);
  const id = data.get("_id");
  const res = await axiosClient.put(`/api/adventure/${id}`, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
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
