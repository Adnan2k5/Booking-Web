import axios from 'axios';
import { setLanguageHeaders, getCurrentLanguage } from '../Api/language.api.js';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add language header and authorization token
axiosClient.interceptors.request.use(
  (config) => {
    // Add the current language to request headers
    const configWithLang = setLanguageHeaders(config);

    // Add authorization token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      configWithLang.headers.Authorization = `Bearer ${token}`;
    }

    return configWithLang;
  },
  (error) => {
    return Promise.reject(error);
  }
);
