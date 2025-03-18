import axios from 'axios';

const n = async () => {
    try {
        const response = await axios.get('/api/v1/auth/refresh', { withCredentials: true });
        return response.data.success;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
};

export default n;
