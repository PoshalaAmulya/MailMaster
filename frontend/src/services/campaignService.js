import axios from 'axios';

const BASE_URL = 'https://mailmaster-ts0b.onrender.com/api';
const API_URL = `${BASE_URL}/campaigns`;

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('accessToken');
};

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for logging and adding auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request:', {
            method: config.method,
            url: config.url,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

// Campaign service functions
const campaignService = {
    // Get all campaigns
    getCampaigns: async () => {
        try {
            console.log('Fetching campaigns...');
            const response = await axiosInstance.get('/');
            console.log('Campaigns response:', response.data);
            return response.data;
        } catch (error) {
            console.error('getCampaigns error:', error.message);
            throw error;
        }
    },

    // Get single campaign
    getCampaign: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('getCampaign error:', error.message);
            throw error;
        }
    },

    // Create campaign
    createCampaign: async (campaignData) => {
        try {
            const response = await axiosInstance.post('/', campaignData);
            return response.data;
        } catch (error) {
            console.error('createCampaign error:', error.message);
            throw error;
        }
    },

    // Update campaign
    updateCampaign: async (id, campaignData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, campaignData);
            return response.data;
        } catch (error) {
            console.error('updateCampaign error:', error.message);
            throw error;
        }
    },

    // Delete campaign
    deleteCampaign: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('deleteCampaign error:', error.message);
            throw error;
        }
    },

    // Send campaign
    sendCampaign: async (id) => {
        try {
            console.log('Initiating campaign send for ID:', id);
            const response = await axiosInstance.post(`/${id}/send`);
            console.log('Campaign send initiated:', response.data);
            return response.data;
        } catch (error) {
            console.error('sendCampaign error:', error.message);
            throw error;
        }
    },

    // Duplicate campaign
    duplicateCampaign: async (id) => {
        try {
            const response = await axiosInstance.post(`/${id}/duplicate`);
            return response.data;
        } catch (error) {
            console.error('duplicateCampaign error:', error.message);
            throw error;
        }
    },

    // Get active subscribers
    getActiveSubscribers: async () => {
        try {
            console.log('Fetching active subscribers...');
            // Create a new instance specifically for subscribers endpoint
            const subscribersInstance = axios.create({
                baseURL: BASE_URL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Add the same interceptors as the main axiosInstance
            subscribersInstance.interceptors.request.use(
                (config) => {
                    const token = getToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    console.log('Subscribers Request:', {
                        method: config.method,
                        url: config.url,
                        headers: config.headers
                    });
                    return config;
                },
                (error) => {
                    console.error('Subscribers Request error:', error);
                    return Promise.reject(error);
                }
            );

            const response = await subscribersInstance.get('/subscribers/active');
            console.log('Active subscribers response:', response.data);
            return response.data;
        } catch (error) {
            console.error('getActiveSubscribers error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.config?.headers
            });
            throw error;
        }
    },

    // Get processed content with templates
    getProcessedContent: async (contentData) => {
        try {
            const contentInstance = axios.create({
                baseURL: `${BASE_URL}/content`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const response = await contentInstance.post('/process', contentData);
            return response.data;
        } catch (error) {
            console.error('getProcessedContent error:', error.message);
            throw error;
        }
    },

    // Send bulk emails
    sendBulkEmails: async ({ campaignId }) => {
        try {
            console.log('Sending campaign:', campaignId);
            const response = await axiosInstance.post(`/${campaignId}/send`);
            console.log('Send campaign response:', response.data);
            return response.data;
        } catch (error) {
            console.error('sendBulkEmails error:', error.message);
            throw error;
        }
    },

    // Execute sendCampaignEmails.js directly
    executeSendCampaignScript: async (campaignId) => {
        try {
            console.log('Executing sendCampaignEmails.js for campaign:', campaignId);
            const response = await axios.post(`${BASE_URL}/execute-script`, {
                scriptName: 'sendCampaignEmails.js',
                campaignId: campaignId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            console.log('Script execution response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Script execution error:', error.message);
            throw error;
        }
    },

    // Execute email sending script
    executeScript: async (campaignId) => {
        try {
            const response = await axiosInstance.post('/execute-script', { campaignId });
            return response.data;
        } catch (error) {
            console.error('executeScript error:', error.message);
            throw error;
        }
    },

    // Generate email content using AI
    generateContent: async ({ prompt, keyPoints }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/content/test-generate`,
                { prompt, keyPoints },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('AI Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Content generation error:', error.message);
            throw error;
        }
    }
};

export default campaignService; 
