
import { axiosClient } from "../AxiosClient/axios";

export const getAllSessions = async ({
  adventure = '',
  location = '',
  session_date = '',
} = {}) => {
  try {
    const params = new URLSearchParams();
  if (adventure && adventure.trim() !== '') params.append('adventure', adventure);
  if (location && location.trim() !== '') params.append('location', location);
  if (session_date && session_date.trim() !== '') params.append('session_date', session_date);
  const res = await axiosClient.get(`/api/session/instructors?${params.toString()}`);
  return res;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
}

