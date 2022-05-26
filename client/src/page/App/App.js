import React from 'react';
import { Navigate, NavLink, Route, Routes} from 'react-router-dom';


import { observer} from "mobx-react-lite";

import {DocumentPage, TitlePage} from "./TitlePage";
import {AccountPage, StatisticDocPage} from "./AccountPage";
import {useRootStore} from "../../store";

import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import AreaChartOutlined from "@ant-design/icons/lib/icons/AreaChartOutlined";
import {AboutProgramPage} from "../AboutProgramPage/AboutProgramPage";
import {SettingsPage} from "../SettingsPage/SettingsPage";
import {MainPage} from "../../component/MainPage";
import {ToorPage} from "./ToorPage";
import TeamOutlined from "@ant-design/icons/lib/icons/TeamOutlined";
import TrophyOutlined from "@ant-design/icons/lib/icons/TrophyOutlined";
import {InfoPage} from "./InfoPage";



export const AppPage = observer(() => {

    const {current_user} = useRootStore()

    return (
        <MainPage  service="Турниры"
                   title="Личный кабинет BitMex"
                   menu={ <ul className="menu">
                       <li>
                           <NavLink
                               end
                               className="menu_item"
                               activeClassName="active"
                               to="/bit/main">
                               <span className="menu_item_icon"><AreaChartOutlined /></span>
                               <span>Главная</span>
                           </NavLink>

                       </li>
                       <li>
                           <NavLink
                               end
                               className="menu_item"
                               activeClassName="active"
                               to="/bit/account">
                               <span className="menu_item_icon"><TeamOutlined /></span>
                               <span>Аккаунты</span>
                           </NavLink>

                       </li>
                       <li>
                           <NavLink
                               end
                               className="menu_item"
                               activeClassName="active"
                               to="/bit/toors">
                               <span className="menu_item_icon"><TrophyOutlined /></span>
                               <span>Турниры</span>
                           </NavLink>

                       </li>

                   </ul>}
                   route=  {  <Routes>
                       <Route path="/settings/" element={<SettingsPage/>}/>
                       <Route path="/about/" element={<AboutProgramPage/>}/>
                       <Route path="/main" element={<TitlePage/>}/>
                       <Route path="/account" element={<AccountPage/>}/>
                       <Route path="/account/:id" element={<InfoPage/>}/>
                       <Route path="/toors" element={<ToorPage/>}/>
                       <Route path="/*" element={<Navigate replace to="/bit/main"/>}/>
                   </Routes>}
                   prefix = 'bit'
                   current_user={current_user}

        />
    )})


