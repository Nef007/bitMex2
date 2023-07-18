import React, {useEffect} from "react";
import TradingViewWidget from 'react-tradingview-widget';

import "./docum.css"

import {observer} from "mobx-react-lite";

export const TitlePage = observer(props => {






    return (
        <>
            <div className="title">Главная</div>
            <div className="contentOut">
                    <TradingViewWidget symbol="XBTUSDN2023" />
            </div>
        </>

    );

});
