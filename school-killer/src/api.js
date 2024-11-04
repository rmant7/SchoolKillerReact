import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const performOCR = async (userId) => {
    const response = await axios.post(`${API_BASE_URL}/perform_ocr`, { user_id: userId });
    return response.data;
};
