import { axiosClient } from '../AxiosClient/axios';

export const getInstructorBadge = async () => {
  const res = await axiosClient.get(`/api/instructor/instructorAchievement/`, {
    withCredentials: true,
  });
  return res;
};
