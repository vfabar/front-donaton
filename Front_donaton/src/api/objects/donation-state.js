import { donacionApi } from "../base";
const donationState = {
    getAll: async () => {
        const response = await donacionApi.get('/donation-state');
        return response.data;
    }
};
export default donationState;