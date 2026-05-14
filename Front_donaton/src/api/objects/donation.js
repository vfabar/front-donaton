import { donacionApi } from "../base";

const donation = {
    getAll: async () => {
        const response = await donacionApi.get('/donation');
        return response.data;
    },
    create: async (data) => {
        const response = await donacionApi.post('/donation', data);
        return response.data;
    }
};

export default donation;