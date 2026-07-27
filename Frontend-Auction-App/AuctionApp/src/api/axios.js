import axios from 'axios';

const BASE_URL = 'https://auction-app-wby3.onrender.com/api';

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If an access token has expired (401), try to use the refresh token to get
// a new one and retry the original request once, instead of just letting
// the user get silently logged out an hour into their session.
let isRefreshing = false;
let pendingRequests = [];

function resolvePending(newToken) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (isRefreshing) {
      // another request already kicked off a refresh; wait for it
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) return reject(error);
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(API(config));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
        refresh: refreshToken,
      });
      localStorage.setItem('access_token', data.access);
      isRefreshing = false;
      resolvePending(data.access);

      config.headers.Authorization = `Bearer ${data.access}`;
      return API(config);
    } catch (refreshErr) {
      isRefreshing = false;
      resolvePending(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    }
  }
);

export default API;