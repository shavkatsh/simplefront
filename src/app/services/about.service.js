import httpService from "./http.service";

const userEndpoint = "about/";

const userService = {
    getAll: async () => {
        const retData = await httpService.get(userEndpoint);
        const data = retData.data;
        return data;
    },
    getOne: async (name) => {
        const retData = await httpService.get(userEndpoint + name);
        const data = retData.data;
        return data;
    }
};
export default userService;
