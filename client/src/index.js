import React from 'react';
import ReactDOM from 'react-dom';
import "antd/dist/antd.css";
import "./auth.css";
import "./app.css";
import './index.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import ru_RU from "antd/lib/locale-provider/ru_RU";
import moment from 'moment'
import 'moment/locale/ru'
import {rootStore, RootStoreProvider} from './store'
import {AppPage} from "./page/App/App";
import {AdminPage} from "./page/Admin/Admin";



moment.locale('ru')



ReactDOM.render(
    <React.StrictMode>
        <RootStoreProvider store={rootStore}>
            <BrowserRouter>
                <ConfigProvider locale={ru_RU}>
                <Routes>
                    <Route path="/bit/*" element={<AppPage/>}/>
                    <Route path="/admin/*" element={<AdminPage/>}/>
                    <Route path="/*" element={<Navigate replace to="/bit/*"/>}/>
                </Routes>
                </ConfigProvider>
            </BrowserRouter>
        </RootStoreProvider>


    </React.StrictMode>,
    document.getElementById('root')
);
