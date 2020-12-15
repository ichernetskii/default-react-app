// React
import React from "react";

// Translation
import {useTranslation} from "react-i18next";
import i18next from "i18next";

// CSS
import "./page.scss";

// Store
import {useStore} from "components/store";

const Page = () => {
    const { state, dispatch } = useStore();
    const { defaultProperty } = state;
    const [ t, i18n ] = useTranslation();

    return (
        <div className="page">
            <div>
                <p>{t("hello")}</p>
            </div>
            <div>
                <button onClick={() => i18next.changeLanguage('ru')}>RU</button>
                <button onClick={() => i18next.changeLanguage('en')}>EN</button>
                <button onClick={() => i18next.changeLanguage('de')}>DE</button>
            </div>
            <img className={"img"} src={require("./img/react.png")}  alt={"react"}/>
            <div>
                Default property: { defaultProperty }
            </div>
        </div>
    );
};

export default Page;
