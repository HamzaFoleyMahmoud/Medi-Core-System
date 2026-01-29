import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from '@/types/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        if (error.response) {
            // Handle 401 Unauthorized - redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                window.location.href = '/login';
            }

            // Handle 403 Forbidden
            if (error.response.status === 403) {
                console.error('Access denied');
            }

            // Return formatted error
            const apiError: ApiError = {
                message: error.response.data?.message || 'An error occurred',
                code: error.response.status.toString(),
                details: error.response.data?.details,
            };
            return Promise.reject(apiError);
        }

        // Network error
        const networkError: ApiError = {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
        };
        return Promise.reject(networkError);
    }
);

// Helper function to extract data from response
export const extractData = <T>(response: ApiResponse<T>): T => {
    return response.data;
};

export default apiClient;
