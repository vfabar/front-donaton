import { logisticaApi } from "../base";
const logistic = {
    getAll: async () => {
        const response = await logisticaApi.get('/logistic'); // Corregido el typo que pusiste: logisitc
        return response.data;
    },
    getById: async (id) => {
        const response = await logisticaApi.get(`/logistic/${id}`);
        return response.data;
    },
    create: async (data) => {
    const response = await logisticaApi.post('/logistic', data); // Ajusta la URL según tu backend
    return response.data;
  }
  
};
export default logistic;