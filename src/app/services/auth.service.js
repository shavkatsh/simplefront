import axios from "axios";
import localStorageService from "./localStorage.service";
const httpPostG = axios.create({
    baseURL: process.env.REACT_APP_BE_HOST + "auth/"
});

export const httpAuth = httpPostG;

const authService = {
    register: async (payload) => {
        const { data } = await httpAuth.post(`signUp`, payload);
        return data;
    },
    login: async ({
        email,
        password
        // , ...rest
    }) => {
        const { data } = await httpAuth.post("signInWithPassword", {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    refresh: async () => {
        const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
};

export default authService;
