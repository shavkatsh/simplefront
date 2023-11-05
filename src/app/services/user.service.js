import httpService from "./http.service";
import localStorageService from "./localStorage.service";

const userEndpoint = "user/";

const userService = {
    get: async () => {
        // const { data } = await httpService.get(userEndpoint);
        const retData = await httpService.get(userEndpoint);
        const data = retData.data;
        return data;
    },
    getPendingUsersActivation: async () => {
        const url = userEndpoint + "pendingactivation/";
        const { data } = await httpService.get(url);
        console.log("getPendingUsersActivation => data : ", data);
        return data;
    },
    create: async (payload) => {
        // const { data } = await httpService.put(
        const { data } = await httpService.patch(
            userEndpoint + "create/" + payload.userid,
            payload
        );
        return data;
    },
    update: async (payload) => {
        // use "patch" to data update partially and exising data not listed in payload will not be deleted
        console.log("payload: update: ", payload);

        const { data } = await httpService.patch(
            userEndpoint + "edit/" + payload.id, // the user to edit
            {
                ...payload,
                // first_name: payload.firstname,
                // last_name: payload.lasttname,
                // full_name: payload.fullname,
                // additioanal_name: payload.additioanalname,
                // alt_phone: payload.altphone,
                // street_address: payload.streetaddress,
                // contact_email: payload.email,
                // contains the user ID that will be the same if it is edited by the user himself,
                // or will be different if edited by the admin or developer (the back end will check if the user is admin or developer)
                edited_by: localStorageService.getUserId() // who is editing ?
            }
        );
        return data;
    },
    activate: async (payload) => {
        // use "patch" to data update partially and exising data not listed in payload will not be deleted
        console.log("payload: activate: ", payload);
        const { data } = await httpService.patch(
            userEndpoint + "activate", // the user to edit
            {
                ...payload,
                activatedBy: localStorageService.getUserId() // who is activating ?
            }
        );
        return data;
    },
    getCurrentUser: async () => {
        const url = userEndpoint + localStorageService.getUserId();
        const { data } = await httpService.get(url);
        console.log("userService => data : ", data);
        return data;
    },
    getUserData: async (userid) => {
        const url = userEndpoint + userid;
        const { data } = await httpService.get(url);
        console.log("userdata", data);
        return data;
    }
};
export default userService;
