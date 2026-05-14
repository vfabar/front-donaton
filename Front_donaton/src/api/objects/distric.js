import { necesidadesApi } from "../base";
const distric = {
    getAll: async () => {
        const response = await necesidadesApi.get('/distric');
        return response.data;
    },
    getByRegion: async (regionId) => {
        const response = await necesidadesApi.get(`/distric/region/${regionId}`);
        return response.data;
    }
};
export default distric;