import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../config.json";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localStorageService, {
    setTokens
} from "../services/localStorage.service";
import { useHistory } from "react-router-dom";
import rules from "../config/rules";

const httpPostG = axios.create({
    baseURL: process.env.REACT_APP_BE_HOST + "auth/"
});

export const httpAuth = httpPostG;

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setUser] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const history = useHistory();
    // language of the current session
    const [currentSessionLanguage, setCurrentSessionLanguage] = useState(1);

    function errorCatcher(error) {
        if (error.response && error.response.data) {
            const { message } = error.response.data;
            setError(message);
        } else {
            toast.error(
                error.message
                    ? error.message
                    : "Something went wrong. Try it later!"
            );
        }
    }

    async function getUserData() {
        try {
            // const { content } = await userService.getCurrentUser();
            const userData = await userService.getCurrentUser();
            const content = userData;
            console.log("userService.getCurrentUser()", content);
            content.language = content.language
                ? content.language
                : config.defaultLanguageId; // if not stored in database for this user then set to 1 (English)
            setUser(content);
            // setCurrentSessionLanguage((prevState) => content.language);
            updateCurrentSessionLanguage(content.language);
            // setCurrentSessionLanguage(content.language || 1);
            console.log("currentUser in getUserData", currentUser);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (localStorageService.getAccessToken()) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);
    useEffect(() => {
        console.log("useEffect for [currentUser]");
    }, [currentUser]);

    function updateCurrentSessionLanguage(langId) {
        setCurrentSessionLanguage((prevState) => langId);
    }

    async function signIn({ email, password, confirmationCode }) {
        try {
            const { data } = await httpAuth.post(`login`, {
                email,
                password,
                confirmationCode
            });
            setTokens(data);
            await getUserData();
        } catch (error) {
            errorCatcher(error);
            let errorMessage = "";
            if (error.response && error.response.data) {
                const { code, message } = error.response.data.error;
                // analyze the error and trhow error object with the required message
                console.log("code, message", code + "," + message);

                if (code === 400) {
                    if (message === "EMAIL_NOT_FOUND") {
                        errorMessage = "Incorrect email";
                    } else if (message === "INVALID_PASSWORD") {
                        errorMessage = "Incorrect password";
                    } else if (
                        message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")
                    ) {
                        // this message is too long : TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.
                        errorMessage = "Too many attempts, try later!";
                        toast.error(errorMessage);
                    } else {
                        errorMessage = "Login error: " + message;
                        toast.error(errorMessage);
                    }
                    throw new Error(errorMessage);
                }
            } else {
                errorMessage = error.message ? error.message : "Unknown error";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        }
    }

    async function forgotPassword(email) {
        try {
            const { data } = await httpAuth.post(`forgotpassword`, email);
            if (data) {
                toast.info(
                    `Email was sent to reset the password. The link will expire in ${rules.resetPasswordExpirationPeriodInMin} munutes.`
                );
            }
            // setTokens(data);
            // await getUserData();
        } catch (error) {
            errorCatcher(error);
            let errorMessage = "";
            if (error.response && error.response.data) {
                const { code, message } = error.response.data.error;
                // analyze the error and trhow error object with the required message
                console.log("code, message", code + "," + message);

                if (code === 400) {
                    if (message === "EMAIL_NOT_FOUND") {
                        errorMessage = "Incorrect email";
                    } else if (message === "INVALID_PASSWORD") {
                        errorMessage = "Incorrect password";
                    } else if (
                        message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")
                    ) {
                        // this message is too long : TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.
                        errorMessage = "Too many attempts, try later!";
                        toast.error(errorMessage);
                    } else {
                        errorMessage = "Login error: " + message;
                        toast.error(errorMessage);
                    }
                    throw new Error(errorMessage);
                }
            } else {
                errorMessage = error.message ? error.message : "Unknown error";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        }
    }

    function logOut() {
        localStorageService.removeAuthData();
        setUser(null);
        toast.info("logged out succesfully");
        history.push("/");
    }

    // returns random integer, used to imitate data for rate and completeMeetings
    // function randomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1) + min);
    // }

    async function resetPassword({ email, password, resetCode }) {
        try {
            const { data } = await httpAuth.post(`resetpassword`, {
                email,
                password,
                resetCode
            });
            if (data) toast.info(data.message);
            console.log("Password was reset:", data);
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;

            // analyze the error and trhow errro object with the required message
            if (code === 400) {
                if (message === "EMAIL_NOT_FOUND") {
                    toast.error("Incorrect email");
                } else if (message === "CODE_EXPIRED") {
                    toast.error(
                        "Code expired, click on 'Forgot password' again to get a new email."
                    );
                } else if (message === "INVALID_DATA") {
                    toast.error("Invalid data");
                } else if (message === "RESET_NOT_FOUND") {
                    toast.error(
                        "Reset code not found, try to click on 'Forgot password' again."
                    );
                } else if (message === "CODE_DOES_NOT_MATCH") {
                    toast.error(
                        "Wrong reset code, try to click on 'Forgot password' again."
                    );
                } else {
                    toast.error(message);
                }
            }
        }
    }

    async function signUp({ email, password, name, phone, ...rest }) {
        try {
            const { data } = await httpAuth.post(`register`, {
                email,
                password,
                name
            });
            setTokens(data);
            await createUser({
                userid: data.userid,
                email,
                name,
                language: currentSessionLanguage || 1, // save whathever was selected at the moment of registration, if not defined then set to 1 (English) by default
                useDuplicateEntity: config.useDuplicateEntity,
                useDuplicateContactInfo: config.useDuplicateContactInfo,
                // phone,
                // image: `https://avatars.dicebear.com/api/avataaars/${(
                //     Math.random() + 1
                // )
                //     .toString(36)
                //     .substring(7)}.svg`,
                ...rest
            });
            await getUserData();
            console.log("Created data for the NEW user:", data);
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            // analyze the error and trhow errro object with the required message
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "User with this email already exists"
                    };
                    throw errorObject;
                }
            }
        }
    }

    async function createUser(data) {
        try {
            const { content } = await userService.create(data);
            setUser(content);
        } catch (error) {
            errorCatcher(error);
        }
    }

    async function updateUser(data) {
        try {
            const content = await userService.update(data);
            console.log(content);
            if (
                data.id.toString() ===
                localStorageService.getUserId().toString()
            ) {
                setUser(content);
            }
        } catch (error) {
            console.log("updateUser error", error);
            errorCatcher(error);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                signUp,
                signIn,
                forgotPassword,
                currentUser,
                resetPassword,
                logOut,
                updateUser,
                currentSessionLanguage,
                updateCurrentSessionLanguage
            }}
        >
            {!isLoading ? children : "Loading..."}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AuthProvider;
