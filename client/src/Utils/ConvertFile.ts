import axios from 'axios';

export const ConvertToFile = async (url: string) => {
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        return response?.data || null;
    } catch (error) {}
};

export default ConvertToFile;
