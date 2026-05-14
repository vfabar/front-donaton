import { necesidadesApi } from "../base";
const ubication = {
    getAll: async () => {
        const response = await necesidadesApi.get('/ubication');
        return response.data;
    },
    create: async (data) => {
        const response = await necesidadesApi.post('/ubication', data);
        return response.data;
    }
};
export default ubication;