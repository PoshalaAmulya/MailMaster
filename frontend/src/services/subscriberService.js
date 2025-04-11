import axios from 'axios';

const API_URL = 'https://mailmaster-ts0b.onrender.com/api/subscribers';

// Get token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Subscriber service functions
export const subscriberService = {
    // Get all subscribers with optional filters
    getSubscribers: async (page = 1, limit = 50, filters = {}) => {
        const params = new URLSearchParams({
            page,
            limit,
            ...filters
        });
        const response = await axiosInstance.get(`/?${params}`);
        return response.data;
    },

    // Get single subscriber
    getSubscriber: async (id) => {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    },

    // Create subscriber
    createSubscriber: async (subscriberData) => {
        const response = await axiosInstance.post('/', subscriberData);
        return response.data;
    },

    // Update subscriber
    updateSubscriber: async (id, subscriberData) => {
        const response = await axiosInstance.put(`/${id}`, subscriberData);
        return response.data;
    },

    // Delete subscriber
    deleteSubscriber: async (id) => {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    },

    // Import subscribers (CSV)
    importSubscribers: async (fileData) => {
        const formData = new FormData();
        formData.append('file', fileData);
        const response = await axiosInstance.post('/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}; 
