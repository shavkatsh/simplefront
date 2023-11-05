import React, { useEffect, useState } from "react";
import aboutService from "../services/about.service";

const Main = () => {
    const service = aboutService.getOne;
    const [aboutInfo, setAboutInfo] = useState("Loading..."); // items on the list

    const loadAboutInfo = async () => {
        // return await userService.getPendingUsersActivation();
        return await service("Test");
        // return await service("LenaLeonovaSchool");
    };
    useEffect(() => {
        // gets data and calls setItemsOnTheList to load it into itemsOnTheList
        loadAboutInfo().then((data) => setAboutInfo(data.description));
    }, []);

    return (
        <>
            {/* START - added for Lena Site */}
            {/* <Header /> */}
            <h1> Simple app info from database: </h1>
            <h2> {aboutInfo} </h2>
            {/* <Footer /> */}
            {/* END - added for Lena Site */}
        </>
    );
};

export default Main;
