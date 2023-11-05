import configFile from "./../config.json";

const TOKEN_KEY = "iwt-token";
const REFRESH_KEY = "iwt-refresh-token";
const EXPIRES_KEY = "iwt-expires";
const USERID_KEY = "user-local-id";

export function setTokens({
    accessToken: idToken,
    userid: localId,
    refreshToken,
    expiresIn = configFile.tokenExpiresIn // in seconds!
}) {
    const expiresDate = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(USERID_KEY, localId);
    localStorage.setItem(TOKEN_KEY, idToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(EXPIRES_KEY, expiresDate);
}

export function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY);
}
export function removeAuthData() {
    localStorage.removeItem(USERID_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRES_KEY);
}

export function getTokenExpiresDate() {
    return localStorage.getItem(EXPIRES_KEY);
}

export function getUserId() {
    return localStorage.getItem(USERID_KEY);
}

const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getTokenExpiresDate,
    getUserId,
    removeAuthData
};

export default localStorageService;
