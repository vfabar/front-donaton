import { logisticaApi, donacionApi, necesidadesApi } from "../base";

const user = {
    // Por defecto usa Logística, pero puedes pasarle el "service" como parámetro si quieres forzar otro
    getAll: async (api = logisticaApi) => {
        const response = await api.get('/user');
        return response.data;
    },
    getById: async (id, api = logisticaApi) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },
    createUser: async (data) => {
        const response = await logisticaApi.post('/user', data);
        return response.data;
    }
};
export default user;