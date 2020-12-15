// React
import React from "react";
import ReactDOM from "react-dom";

// Translation
import i18next from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import en from "translation/en.json";
import ru from "translation/ru.json";
import de from "translation/de.json";

// Components
import App from "components/app";

i18next
    .use(initReactI18next)
    .init({
        resources: { ru, en, de },
        lng: "ru",
        /* When react i18next not finding any language to as default in browser */
        fallbackLng: "ru",
        /* debugger For Development environment */
        debug: process.env.NODE_ENV === "development",
        ns: ["translations"],
        defaultNS: "translations",
        keySeparator: "."
    });


ReactDOM.render(<App />, document.getElementById("root"));
