import React, { useEffect, useState } from "react";
// import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import config from "../../config.json";

const LanguageSelect = () => {
    const { currentUser, updateCurrentSessionLanguage } = useAuth();
    const {
        getLanguageItemsList,
        languageSet,
        currLangId,
        getLangAbbreviation
    } = useLanguage();
    console.log("currentUser in LanguageSelect", currentUser);

    const [isOpen, setOpen] = useState(false);

    // executed when the language was selected
    const selLanguage = (langID) => {
        console.log("selected : ", langID);
        // update all language items IF they are not loaded by each section/component separately
        if (!config.loadBySection) {
            getLanguageItemsList(langID, "");
        }
        // update the current session language in useAuth so it can be used for newly registerd users when they save their info
        updateCurrentSessionLanguage(langID);
    };

    const toggleMenu = () => {
        setOpen((prevState) => !prevState);
    };

    // update when language changed
    useEffect(() => {
        console.log("LanguageSelect updated");
    }, [currLangId, currentUser]);

    const currentLanguage = currLangId
        ? {
              langId: currLangId,
              langShort: getLangAbbreviation(currLangId)
          }
        : {
              langId: config.defaultLanguageId,
              langShort: config.defaultLanguageShort
          };
    return (
        <div className="dropdown" onClick={toggleMenu}>
            <div className="btn dropdown-toggle d-flex align-items-center">
                <div className="me-2">{currentLanguage.langShort}</div>
            </div>
            <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
                {languageSet ? (
                    languageSet.map((elm, ind) => (
                        <Link
                            key={ind}
                            role="button"
                            onClick={() => selLanguage(elm.langId)}
                            to="" // need "to" otherwise there will be error
                            // to={`/language/${elm.langId}`}
                            className="dropdown-item"
                        >
                            {elm.langShort}
                        </Link>
                    ))
                ) : (
                    <Link
                        role="button"
                        name="password"
                        onClick={() => selLanguage(currentLanguage.langId)}
                        to="" // need "to" otherwise there will be error
                        // to={`/language/$(currentLanguage.langId)`}
                        className="dropdown-item"
                    >
                        {currentLanguage.langShort}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default LanguageSelect;
