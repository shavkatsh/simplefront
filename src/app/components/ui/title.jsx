import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NavProfile from "./navProfile";
import LanguageSelect from "./languageSelect";
import { useLanguage } from "../../hooks/useLanguage";
import config from "../../config.json";

const Title = () => {
    const { getItemText, updateLangSections, currLangId } = useLanguage();
    const langSection = "NavBar,NotLogged";
    const { currentUser } = useAuth();
    // console.log("* * * Title");

    // update when language changed
    useEffect(() => {
        console.log("navProfile updated");
    }, [currLangId]);
    useEffect(() => {
        if (config.loadBySection) {
            updateLangSections(`|${langSection}|`);
        }
    }, []);

    return (
        <nav className="navbar bg-light mb-3">
            <div className="container fluid py-1 py-lg-1 ">
                <div
                    style={{
                        fontFamily: "Kaushan Script, serif",
                        color: " var(--bs-yellow)"
                    }}
                >
                    <div className="navbar-brand">Simple app</div>
                </div>
                <div className="d-flex">
                    <LanguageSelect />
                </div>
                <div className="d-flex">
                    {currentUser ? (
                        <NavProfile />
                    ) : (
                        <Link
                            className="nav-link "
                            aria-current="page"
                            to="/login"
                        >
                            {getItemText(`${langSection},login`, "Login")}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Title;
