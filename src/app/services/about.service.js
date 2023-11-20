import httpService from "./http.service";

const userEndpoint = process.env.REACT_APP_SERVER_API_URL + "about/";

console.log("'REACT_APP_SERVER_API_URL => '", userEndpoint);

const userService = {
    getAll: async () => {
        const retData = await httpService.get(userEndpoint);
        const data = retData.data;
        return data;
    },
    getOne: async (name) => {
        console.log(
            "'REACT_APP_SERVER_API_URL + name => '",
            userEndpoint + name
        );
        const retData = await httpService.get(userEndpoint + name);
        const data = retData.data;
        return data;
    }
};
export default userService;
