import { necesidadesApi } from "../base";
const needsType = {
    getAll: async () => {
        const response = await necesidadesApi.get('/needs-type');
        return response.data;
    }
};
export default needsType;