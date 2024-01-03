import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log(error);
  
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const refreshToken = localStorage.getItem('refresh');
          const response = await axios.post('/api/users/token/refresh/', { refresh: refreshToken });

          const token = response.data.access;
          const refresh = response.data.refresh;
  
          localStorage.setItem('token', token);
          localStorage.setItem('refresh', refresh);
  
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
  
      return Promise.reject(error);
    }
  );

export default api