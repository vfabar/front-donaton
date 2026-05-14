import { logisticaApi } from "../base";
const logistic = {
    getAll: async () => {
        const response = await logisticaApi.get('/logisitc'); // Corregido el typo que pusiste: logisitc
        return response.data;
    },
    getById: async (id) => {
        const response = await logisticaApi.get(`/logisitc/${id}`);
        return response.data;
    }
};
export default logistic;