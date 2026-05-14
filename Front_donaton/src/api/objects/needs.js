import { necesidadesApi } from "../base";

const needs = {
    getAll: async () => {
        const response = await necesidadesApi.get('/Needs');
        return response.data;
    },
    getById: async (id) => {
        const response = await necesidadesApi.get(`/Needs/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await necesidadesApi.post('/Needs', data);
        return response.data;
    }
};

export default needs;