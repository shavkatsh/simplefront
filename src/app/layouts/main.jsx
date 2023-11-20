import React, { useEffect, useState } from "react";
import aboutService from "../services/about.service";

const Main = () => {
    const service = aboutService.getOne;
    const [aboutInfo, setAboutInfo] = useState("Loading..."); // items on the list

    const loadAboutInfo = async () => {
        return await service("Test");
    };
    useEffect(() => {
        loadAboutInfo().then((data) => setAboutInfo(data.description));
    }, []);

    return (
        <>
            <h1> Retrieving data from the database: </h1>
            <h2> {aboutInfo} </h2>
        </>
    );
};

export default Main;
