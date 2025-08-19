import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"; 

export const createBatchPayout = async (data, token) => {
  const res = await axios.post(`${API_URL}/payouts/batch`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getBatchPayouts = async (batchId, token) => {
  const res = await axios.get(`${API_URL}/payouts/batch/${batchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserPayouts = async (userId, token) => {
  const res = await axios.get(`${API_URL}/payouts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
