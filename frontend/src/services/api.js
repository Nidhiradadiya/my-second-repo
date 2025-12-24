import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            error.message = 'Network Error';
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet, try refreshing token
        // Also skip if the request is for login, as 401 there means invalid credentials, not expired token
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                localStorage.setItem('accessToken', data.accessToken);
                // The instruction snippet was incomplete here, preserving original logic for newRefreshToken
                // and setting it in localStorage, and also setting default header for api instance.
                localStorage.setItem('refreshToken', data.refreshToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                authAPI.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // If unauthorized and not a refresh token issue, logout
        // Ignore 401 on login page to allow handling invalid credentials
        if (error.response?.status === 401 && !originalRequest.url.includes('/auth/login')) {
            authAPI.logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
            }));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
            }));
        }
        return response.data;
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        // Update local storage with fresh data
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response.data;
    },

    resetPassword: async (token, password) => {
        const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },
};

export default api;
