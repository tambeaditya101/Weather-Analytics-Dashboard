import axios from 'axios';

export const apiClient = axios.create({
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }

    return Promise.reject(error);
  }
);
