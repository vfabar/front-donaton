import { necesidadesApi } from "../base";
const region = {
    getAll: async () => {
        const response = await necesidadesApi.get('/region');
        return response.data;
    }
};
export default region;