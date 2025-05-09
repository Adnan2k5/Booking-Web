import { axiosClient } from "../AxiosClient/axios";

export const getAllSession = async () => {
  try {
    const res = await axiosClient.get(`/api/session/instructors`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
}