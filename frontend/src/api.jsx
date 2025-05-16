import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getDosas = async (userId, created_by) => {
    try {
        let url = `${API_URL}/get`;
        const params = new URLSearchParams();

        if (userId) {
            params.append('userId', userId);
        }

        if (created_by) {
            params.append('created_by', created_by);
        }

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching dosas:", error);
    }
};

export const createDosa = async (dosaData) => {
    try {
        const response = await axios.post(`${API_URL}/post`, dosaData);
        return response.data;
    } catch (error) {
        console.error("Error creating dosa:", error);
    }
};

export const deleteDosa = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting dosa:", error);
    }
};

export const updateDosa = async (id, dosaData) => {
    try {
        const response = await axios.put(`${API_URL}/put/${id}`, dosaData);
        return response.data;
    } catch (error) {
        console.error("Error updating dosa:", error);
    }
};

export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, loginData, {
            withCredentials: true // This is important for cookies to be sent/received
        });

        // Store token in localStorage for client-side access if needed
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error; // Re-throw the error so it can be caught by the caller
    }
};

export const signUp = async (signUpData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, signUpData, {
            withCredentials: true // This is important for cookies to be sent/received
        });

        // Store token in localStorage for client-side access if needed
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error; // Re-throw the error so it can be caught by the caller
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/get`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/users/logout`, {}, {
            withCredentials: true
        });

        // Remove token from localStorage
        localStorage.removeItem('token');

        return response;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        // Get token from cookie (handled by withCredentials)
        const response = await axios.get(`${API_URL}/users/current`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error("Error getting current user:", error);
        // Clear any invalid token
        localStorage.removeItem('token');
        return null;
    }
};

// Helper function to set auth token in axios headers
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

