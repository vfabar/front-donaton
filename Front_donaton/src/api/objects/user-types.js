import { logisticaApi } from "../base";
const userTypes = {
    getAll: async () => {
        const response = await logisticaApi.get('/user-types');
        return response.data;
    }
};
export default userTypes;