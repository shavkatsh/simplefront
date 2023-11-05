import httpService from "./http.service";
import config from "../config.json";
import languageSupport from "../utils/languageSupport.json";
const languageEndpoint = "language/";

const languageService = {
    // get set of languages and items available from database or from JSON file
    get: async (langId, subSet) => {
        if (config.defaultLanguageSettings.source === "JSON") {
            return getItemsFromJsonFile(langId, subSet);
        }
        const { data } = await httpService.get(languageEndpoint + langId);
        console.log("lang support data:", data);
        return data;
    }
};

// get language items from JSON file and keep the same structure used by database
// return array of objects in this form when langId > 0 (list of items for the selected language):
// {
//     id: 9,
//     itemIndex: 'Users,EditUser,zip',
//     language: '1,EN',
//     itemText: 'Zip/Post index',
//     helpText: 'Post index',
//     errMsg: 'Zip is required '
// },
// OR return array of objects in this form when langId === "" (i.e. list of available languages):
// {
//     langId: 1,
//     langLong: 'English(US)',
//     langShort: 'en-US'
// }
const getItemsFromJsonFile = (langId, subSets) => {
    if (subSets === "" && langId !== "") {
        console.log("**** generic request ************");
    }
    const languageItems = languageSupport;
    const data = [];
    // langId = 1;
    // get items for the language
    if (langId && langId > 0) {
        const languageSet = languageItems[langId];
        const setKeys = Object.keys(languageSet);
        // if there is no "Language" section then return and empty array
        if (!setKeys.includes("Language")) return [];
        // language information
        const languageInfo = languageSet.Language.info;

        // setKeys.forEach((element) => console.log(element));
        setKeys.forEach((section, ind) => {
            if (section !== "Language") {
                // if subSets = "" then get all sections , i.e. the full set
                // if subSets != "" then get only sections specified in subSets (for example, single section "|LoginForm,Label,email|" or multiple  "|LoginForm,Label,email|NavBar,Logged|")
                if (subSets === "" || subSets.includes("|" + section + "|")) {
                    const sectionData = languageSet[section];
                    const sectionKeys = Object.keys(sectionData);
                    sectionKeys.forEach((field, ind2) => {
                        const fieldData = sectionData[field];
                        data.push({
                            id: Number(ind.toString() + ind2.toString()),
                            language:
                                languageInfo.lang_id +
                                "," +
                                languageInfo.lang_short,
                            itemIndex: section + "," + field,
                            itemText: fieldData.item_text,
                            // itemText: fieldData.item_text + (subSets === "" ? "#" : ` *`), // * means that it was set for the subset, # - generic call for all subsets
                            helpText: fieldData.help_text
                                ? fieldData.help_text
                                : "",
                            // helpText: fieldData.help_text ? fieldData.help_text + (subSets === "" ? "#" : `*`) : "",
                            errMsg: fieldData.err_msg ? fieldData.err_msg : ""
                            // errMsg: fieldData.err_msg ? fieldData.err_msg + (subSets === "" ? "#" : `*`) : ""
                        });
                    });
                }
            }
        });
        return data;
    } else {
        const setKeys = Object.keys(languageItems);
        setKeys.forEach((field, ind2) => {
            const fieldData = languageItems[field].Language.info;
            data.push({
                langId: fieldData.lang_id,
                langLong: fieldData.lang_long,
                langShort: fieldData.lang_short
            });
        });
        return data;
    }
};

// version #1 - uses the old languageSupport_old.json file
// const getItemsFromJsonFile = (langId, subSection) => {
//     if (langId && langId > 0) {
//         const data = languageSupport
//             .filter((item) => item.lang_id === langId)
//             .map((elm, ind) => {
//                 return {
//                     id: ind,
//                     language: elm.lang_id + "," + elm.lang_short,
//                     itemIndex: elm.location_mnemo + "," + elm.item_mnemo,
//                     itemText: elm.item_text,
//                     helpText: elm.helpText ? elm.helpText : "",
//                     errMsg: elm.errMsg ? elm.errMsg : ""
//                 };
//             });
//         return data;
//     } else {
//         const data = languageSupport
//             .filter((item) => item.item_mnemo === "selectLanguage")
//             .map((elm) => {
//                 return {
//                     langId: elm.lang_id,
//                     langLong: elm.lang_long,
//                     langShort: elm.lang_short
//                 };
//             });
//         return data;
//     }
// };

export default languageService;
