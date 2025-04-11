// const API_URL = 'http://localhost:5000/api';

// export const apiCall = async (endpoint, options = {}) => {
//     try {
//         const url = `${API_URL}${endpoint}`;
//         const defaultHeaders = {
//             'Content-Type': 'application/json',
//         };

//         const response = await fetch(url, {
//             ...options,
//             headers: {
//                 ...defaultHeaders,
//                 ...options.headers,
//             }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || 'Something went wrong');
//         }

//         return data;
//     } catch (error) {
//         throw error;
//     }
// };

// export const testConnection = async () => {
//     return await apiCall('/test');
// };

// export const login = async (credentials) => {
//     try {
//         const response = await apiCall('/auth/login', {
//             method: 'POST',
//             body: JSON.stringify(credentials),
//         });
        
//         // Validate response data structure
//         if (!response.data || !response.data.token) {
//             console.error('Invalid login response format:', response);
//             throw new Error('Invalid response format from server');
//         }
        
//         return response;
//     } catch (error) {
//         console.error('Login API error:', error);
//         throw error;
//     }
// };

// export const register = async (userData) => {
//     return await apiCall('/auth/register', {
//         method: 'POST',
//         body: JSON.stringify(userData),
//     });
// }; 

// export const apiCall = async (endpoint, options = {}) => {
//     try {
//         const url = `${API_URL}${endpoint}`;
//         const defaultHeaders = {
//             'Content-Type': 'application/json',
//         };

//         const response = await fetch(url, {
//             ...options,
//             headers: {
//                 ...defaultHeaders,
//                 ...options.headers,
//             }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || 'Something went wrong');
//         }

//         return data;
//     } catch (error) {
//         throw error;
//     }
// };

// export const testConnection = async () => {
//     return await apiCall('/test');
// };

// export const login = async (credentials) => {
//     try {
//         const response = await apiCall('/auth/login', {
//             method: 'POST',
//             body: JSON.stringify(credentials),
//         });
        
//         // Validate response data structure
//         if (!response.data || !response.data.token) {
//             console.error('Invalid login response format:', response);
//             throw new Error('Invalid response format from server');
//         }
        
//         return response;
//     } catch (error) {
//         console.error('Login API error:', error);
//         throw error;
//     }
// };

// export const register = async (userData) => {
//     return await apiCall('/auth/register', {
//         method: 'POST',
//         body: JSON.stringify(userData),
//     });
// }; 
 
const API_URL = 'https://mailmaster-ts0b.onrender.com/api';

export const apiCall = async (endpoint, options = {}) => {
    try {
        const url = `${API_URL}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const testConnection = async () => {
    return await apiCall('/test');
};

export const login = async (credentials) => {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        // Validate response data structure
        if (!response.data || !response.data.token) {
            console.error('Invalid login response format:', response);
            throw new Error('Invalid response format from server');
        }
        
        return response;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

export const register = async (userData) => {
    return await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};
