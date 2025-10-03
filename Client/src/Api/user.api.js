import { axiosClient } from '../AxiosClient/axios';

export const fetchUsers = async ({
  search = '',
  role = 'all',
  page = 1,
  limit = 10,
}) => {
  const params = { search, role, page, limit };
  const { data } = await axiosClient.get('/api/user', { params });
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await axiosClient.delete(`/api/user/${userId}`);
  return data;
};

export const getUserAdventures = async () => {
  const { data } = await axiosClient.get('/api/user/adventure', {
    withCredentials: true,
  });
  return data;
};

export const getUserAdventureExperiences = async () => {
  const { data } = await axiosClient.get('/api/user/adventure-experiences', {
    withCredentials: true,
  });
  return data;
};

export const updateUserProfile = async (payload) => {
  // If payload contains a file, convert to FormData
  let requestData = payload;
  let config = {
    withCredentials: true,
  };

  const hasProfilePictureFile =
    payload?.profilePicture &&
    ((typeof File !== 'undefined' && payload.profilePicture instanceof File) ||
      (typeof Blob !== 'undefined' && payload.profilePicture instanceof Blob));

  if (hasProfilePictureFile) {
    const formData = new FormData();
    formData.append('profilePicture', payload.profilePicture);

    // Append other fields
    if (payload.name) formData.append('name', payload.name);
    if (payload.bio) {
      if (Array.isArray(payload.bio)) {
        formData.append('bio', JSON.stringify(payload.bio));
      } else {
        formData.append('bio', payload.bio);
      }
    }
    if (payload.languages) {
      formData.append('languages', JSON.stringify(payload.languages));
    }

    requestData = formData;
    config.headers = {
      ...(config.headers || {}),
      'Content-Type': 'multipart/form-data',
    };
  }

  const { data } = await axiosClient.put('/api/user/profile', requestData, config);
  return data;
};

export const getCurrentUser = async () => {
  try {
    const { data } = await axiosClient.get('/api/user/me', {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error(
      "❌ Failed to fetch current user:",
      error.response?.data || error.message
    );
    throw new Error("Unable to retrieve user information");
  }
};

