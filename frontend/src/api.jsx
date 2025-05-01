import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getDosas = async () => {
    try {
        const response = await axios.get(`${API_URL}/get`);
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