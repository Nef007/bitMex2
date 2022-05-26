import React, {useEffect} from "react";
import TradingViewWidget from 'react-tradingview-widget';

import "./docum.css"

import {observer} from "mobx-react-lite";

import {useRootStore} from "../../store";



const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};


export const TitlePage = observer(props => {






    return (
        <>
            <div className="title">Главная</div>
            <div className="contentOut">

                    <TradingViewWidget symbol="BITMEX:XBTUSD" />



            </div>
        </>

    );

});
