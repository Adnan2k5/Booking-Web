import axios from 'axios';
import { setLanguageHeaders, getCurrentLanguage } from '../Api/language.api.js';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add language header
axiosClient.interceptors.request.use(
  (config) => {
    // Add the current language to request headers
    return setLanguageHeaders(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);
