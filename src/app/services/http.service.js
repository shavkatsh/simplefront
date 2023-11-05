// This http.service pattern allows you to use differnt libraries 'fetch' or 'axios' (we use 'axios' below).
// For example, in order to switch from 'axios' to 'fetch' we need to make changes only here - all calling apps will make the same calls to http.service as before
// See Module 2-14-10 for help

import axios from "axios"; // see Module 2-14-5 for help
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import configFile from "../config.json";
import authService from "./auth.service";
import localStorageService from "./localStorage.service";

const http = axios.create({
    baseURL: process.env.REACT_APP_BE_HOST
});
// see Module 2-14-9 about interceptors
//
// intercept and process requests
http.interceptors.request.use(
    // this 'function (config)' is the 1st parameter of interceptors.request.use, which is used
    // to do something with the requets and then call the server
    // see http.interceptors documentation for function (config)
    async function (config) {
        const expiresDate = +localStorageService.getTokenExpiresDate();
        const refreshToken = localStorageService.getRefreshToken();
        // check if token has expired
        const isExpired =
            refreshToken && // if user was authorized
            expiresDate < Date.now(); // and token has expired now
        // check for how long the token was expired
        // if this time exceeds the configFile.maxTimeAfterTokenExpired (in sec, so you need to *1000 below)
        // then token cannot be refreshed -
        // const canBeRenewed =
        //     isExpired && // if user was authorized and his token expired
        //     Date.now() - expiresDate <=
        //         configFile.maxTimeAfterTokenExpired * 1000; // exceeds max allowed time since token expirated
        const now = Date.now();
        const maxExpiratTimeInMiliSec =
            configFile.maxTimeAfterTokenExpiredInSec * 1000;
        const canBeRenewed =
            isExpired && // if user was authorized and his token expired
            now - expiresDate <= maxExpiratTimeInMiliSec; // the time since token expirated is less or equal to the max allowed time for expiration

        // check expiration date
        // if server at localhost (with MongoDB)
        if (isExpired) {
            if (canBeRenewed) {
                // then call API "Exchange a refresh token for an ID token"
                const data = await authService.refresh();

                // localStorageService.setTokens({
                //     refreshToken: data.refreshToken,
                //     accessToken: data.accessToken,
                //     expiresIn: data.expiresIn,
                //     userid: data.userid
                // });
                // below is a short way to write the same as above because keys and values match
                localStorageService.setTokens(data);
            } else {
                // clear local storage if token cannot be refreshed
                // this will cause Unauthorised error 401
                // which will be catched in the calling function like, for example, getUsers() in useUser.jsx
                localStorageService.removeAuthData();
            }
        }
        const accessToken = localStorageService.getAccessToken();
        // if (accessToken) {
        if (accessToken && accessToken !== "undefined") {
            // if user authorized then add "auth" parameter
            config.params = { ...config.params, auth: accessToken };
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return config;
    },
    // this 'function (error)' is the 2nd parameter of interceptors.request.use, which is used to intercept and process errors
    // see http.interceptors documentation for function (error)
    function (error) {
        // if we don't process other errors here then we will pass them further to the caller
        // we need to do this as Promise because 'axios' is 'Promise' calls
        toast.error("Something was wrong. Try it later!!!");
        return Promise.reject(error);
    }
);

// see Module 2-14-9 about interceptors
//
// intercept and process responses
http.interceptors.response.use(
    // this 'array' function is the 1st parameter interceptors.response.use, which is used when
    // the response was succesful, to do something with the response and then pass it to the caller
    (res) => {
        // console.log(">>>>>>>>>> res: ", res);
        if (!res.data) return res; // if no data (like in STATUS 204 for deletion) , then retrun res as is

        // for postgresql:
        // in Postgres we don't have _id as we have it in FireBase
        // that is why we are adding _id field (with the value of id) - to avoid changes everywhere in the code
        // if data don't have id then retutm it as is
        if (Array.isArray(res.data)) {
            res.data = res.data.map((elm) => {
                return elm._id // if we have '_id'
                    ? elm // then return object as is
                    : elm.id // otherwise check if we have 'id'
                    ? { ...elm, _id: elm.id.toString() } // if so then add '_id' with the value of 'id'
                    : elm; // if we don't have 'id' then don't do anything - return as is
            });
        } else {
            res.data = res.data._id
                ? res.data
                : { ...res.data, _id: res.data.id.toString() };
        }

        return res;
    },
    // this 'function (error)' is the 2nd parameter of interceptors.response.use, which is used to intercept and process errors
    // see http.interceptors documentation for function (error)
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            // Logging errors in a separate server https://sentry.io
            // Module 2-14-11 and 2-14-12
            console.log(error);
            toast.error("Something was wrong. Try it later");
        }

        // if we don't process other errors here then we will pass them further to the caller
        // we need to do this as Promise because 'axios' is 'Promise' calls
        return Promise.reject(error);
    }
);
const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};
export default httpService;
