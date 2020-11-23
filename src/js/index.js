import React from "react";
import ReactDOM from "react-dom";
import "../style/main.scss";
import i18next from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import en from "../translation/en.json";
import ru from "../translation/ru.json";
import de from "../translation/de.json";

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


const Img = () => {
    const [ t, i18n ] = useTranslation();

    return (
        <>
            <p>{t("hello")}</p>
            <img className={"img"} src={require("../img/react.png")}  alt={"react"}/>
        </>
    )
}

const App = () => {
    return (
        <>
            <button onClick={() => i18next.changeLanguage('ru')}>RU</button>
            <button onClick={() => i18next.changeLanguage('en')}>EN</button>
            <button onClick={() => i18next.changeLanguage('de')}>DE</button><br/>
            <Img />
        </>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
