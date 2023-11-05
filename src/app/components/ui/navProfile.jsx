import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import config from "./../../config.json";

const LanguageProvider = () => {
    const { currentUser } = useAuth();
    const { getItemText, updateLangSections, currLangId } = useLanguage();
    const langSection = "NavBar,Logged";
    const [isOpen, setOpen] = useState(false);
    const toggleMenu = () => {
        setOpen((prevState) => !prevState);
    };

    // update when language changed
    useEffect(() => {
        console.log("LanguageProvider updated");
        if (config.loadBySection) {
            updateLangSections(`|${langSection}|`);
        }
    }, [currLangId, currentUser]);

    useEffect(() => {
        if (config.loadBySection) {
            updateLangSections(`|${langSection}|`);
        }
    }, []);

    return (
        <div className="dropdown" onClick={toggleMenu}>
            {/* div.btn.dropdown-toggle.d-flex.align-items-center */}
            <div className="btn dropdown-toggle d-flex align-items-center">
                {/* div.me-2 */}
                <div className="me-2">{currentUser.name} </div>
                {/* img.img-responsive.rounded-circle */}
                <img
                    src={currentUser.image}
                    alt=""
                    height="40"
                    className="img-responsive rounded-circle"
                />
            </div>
            <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
                <Link
                    to={`/users/${currentUser._id}`}
                    className="dropdown-item"
                >
                    {getItemText(`${langSection},profile`, "Profile")}
                </Link>

                <Link to="/logout" className="dropdown-item">
                    {getItemText(`${langSection},logout`, "Logout")}
                </Link>
            </div>
        </div>
    );
};

export default LanguageProvider;
