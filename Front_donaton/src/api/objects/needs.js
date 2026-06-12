import { necesidadesApi } from "../base";

const needs = {
    getAll: async () => {
        const response = await necesidadesApi.get('/needs');
        return response.data;
    },
    getById: async (id) => {
        const response = await necesidadesApi.get(`/needs/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await necesidadesApi.post('/needs', data);
        return response.data;
    }
};

export default needs;