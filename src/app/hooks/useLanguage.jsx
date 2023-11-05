import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import LanguageService from "../services/language.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./useAuth";
import config from "../config.json";

const LanguageContext = React.createContext();

export const useLanguage = () => {
    // console.log("* * useLanguage()");
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [isLoading, setLoading] = useState(true);
    // language terms/items in selected language
    const [languageItems, setLanguageItems] = useState([]);
    // languages available for selection
    const [languageSet, setLanguageSet] = useState([]);
    // const [languageSelectSet, setLanguageSelectSet] = useState([]);
    const [error, setError] = useState(null);
    // currently selected language Id, default = 1 for EN (English)
    // can be used to signal language selection change to dependend components
    const [currLangId, setCurrLangId] = useState(1);
    const userLanguage = currentUser
        ? currentUser.language
        : config.defaultLanguageId; // English (1) by default

    // get the list of language items from service at the begining
    useEffect(() => {
        console.log("userLanguage: ", userLanguage);
        if (!config.loadBySection) {
            getLanguageItemsList(userLanguage, "");
        }
    }, []);

    // get the list of language items from service when user changed
    useEffect(() => {
        console.log("userLanguage: ", userLanguage);
        if (!config.loadBySection) {
            getLanguageItemsList(userLanguage, "");
        }
    }, [userLanguage]);

    // track errors
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    // catch errors
    function errorCatcher(error) {
        console.log("error-------", error);
        if (error.response && error.response.data) {
            const { message } = error.response.data;
            setError(message);
        }
    }
    // get language term/item object by its index
    function getLanguageItemByIndex(index) {
        return languageItems.find((p) => p.itemIndex === index);
    }

    // get currently selected language
    function getCurrLanguage() {
        return isLoading ? 1 : currLangId;
    }

    function getLangShortNameByIndex(index) {
        return languageSet.find((p) => p.langId === index);
    }

    // get language term/item text (label,message,etc) by its index and if not available then return the default value you specify
    const getItemText = (textIndex, defaultText) => {
        if (isLoading) return defaultText;
        const item = getLanguageItemByIndex(textIndex);
        if (!item) return defaultText;
        return item.itemText;
    };

    // get language term/item help text by its index and if not available then return the default value you specify
    const getHelpText = (textIndex, defaultText) => {
        if (isLoading) return defaultText;
        const item = getLanguageItemByIndex(textIndex);
        if (!item) return defaultText;
        return item.helpText;
    };

    // get language term/item error message  by its index and if not available then return the default value you specify
    const getErrMsg = (textIndex, defaultText) => {
        if (isLoading) return defaultText;
        const item = getLanguageItemByIndex(textIndex);
        if (!item) return defaultText;
        return item.errMsg;
    };

    // get short name/abbreviation (EN) of the language by its index
    const getLangAbbreviation = (langId, defaultText) => {
        if (isLoading) return defaultText;
        const item = getLangShortNameByIndex(langId);
        if (!item) return defaultText;
        return item.langShort;
    };

    // get short name/abbreviation (EN) of the language by its index
    const updateLangSections = (subSets, langId = currLangId) => {
        getLanguageItemsList(langId, subSets);
    };

    // call language.service to get the list of items from the server
    // and then sets languageSet, languageItems and currLangId
    async function getLanguageItemsList(userLangId, subSets) {
        setLoading(true);
        try {
            // get set of languages available
            const languages = await LanguageService.get("", "");
            // call language.service to get items
            // if (!userLangId) userLangId = config.defaultLanguageId;
            const content = await LanguageService.get(userLangId, subSets);
            // const data = languages.map((elm, ind) => {
            //     return {
            //         label: elm.langShort,
            //         value: elm.langId
            //     };
            // });
            const data = languages.map((elm, ind) => {
                return {
                    ...elm,
                    label: elm.langShort + " " + elm.langLong,
                    value: elm.langId
                };
            });
            // set languages available
            setLanguageSet(data);
            // set to select languages available
            // setLanguageSelectSet(data);
            setCurrLangId(userLangId);
            setLanguageItems(content);
            if (languages && userLangId && content) setLoading(false);
        } catch (error) {
            console.log("error  - get language", error);
            errorCatcher(error);
        }
    }

    return (
        <LanguageContext.Provider
            value={{
                languageItems, // language terms/items in selected language
                languageSet, // languages available for selection
                updateLangSections, // update sections
                // languageSelectSet, // languages used for selection
                currLangId, // currently selected language Id, default = 1 for EN (English) Note: can be null, use getCurrLanguage() if not sure - it will provide default
                getCurrLanguage, // get current language, default = 1 for EN (English)
                getLanguageItemByIndex, // get language term/item object by its index
                getLangAbbreviation, // get short name/abbreviation (EN) of the language by its index
                getLanguageItemsList, // call language.service to get the list of items from the server and then to set languageSet, languageItems and currLangId (current language)
                getItemText, // get language term/item text (label,message,etc) by its index and if not available then return the default value you specify
                getHelpText, // get language term/item help text by its index and if not available then return the default value you specify
                getErrMsg // // get language term/item error message  by its index and if not available then return the default value you specify
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default LanguageProvider;
