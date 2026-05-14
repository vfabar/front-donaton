import { donacionApi } from "../base";
const donationType = {
    getAll: async () => {
        const response = await donacionApi.get('/donation-type');
        return response.data;
    }
};
export default donationType;