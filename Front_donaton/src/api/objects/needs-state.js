import { necesidadesApi } from "../base";
const needsState = {
    getAll: async () => {
        const response = await necesidadesApi.get('/needs-state');
        return response.data;
    }
};
export default needsState;