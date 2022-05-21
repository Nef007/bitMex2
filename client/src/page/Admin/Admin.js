import React from 'react';
import { Navigate, NavLink, Route, Routes} from 'react-router-dom';
import {Badge} from "antd";

import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";

import {observer} from "mobx-react-lite";

import {useRootStore} from "../../store";

import {UsersPageContainer} from "./AdminUserPage/UsersPageContainer";
import {UserPageContainer} from "./AdminUserPage/UserPageContainer";
import {SettingsPage} from "../SettingsPage/SettingsPage";
import {NotificationsPage} from "./NotificationPage/NotificationsPage";
import SoundOutlined from "@ant-design/icons/lib/icons/SoundOutlined";
import {AboutProgramPage} from "../AboutProgramPage/AboutProgramPage";
import {MainPage} from "../../component/MainPage";
import {Notification} from "../../component/Notification/Notification";
import {NoAccessPage} from "../NoAccessPage/noAccessPage";



export const AdminPage = observer(props => {


    const {current_user} = useRootStore()





    return (
        <MainPage service="Администрирование"
                  title="Панель Администратора"
                  menu={<ul className="menu">
                      {/*<li>*/}
                      {/*    <NavLink*/}
                      {/*        className="menu_item"*/}
                      {/*        activeClassName="active"*/}
                      {/*        to="/admin/glossary">*/}
                      {/*        <span className="menu_item_icon"><HddOutlined/></span>*/}
                      {/*        <span>Словари</span>*/}
                      {/*        <Badge className="badge" count={glossary.countNew}/>*/}
                      {/*    </NavLink>*/}
                      {/*</li>*/}
                      <li>
                          <NavLink
                              className="menu_item"
                              activeClassName="active"
                              to="/admin/users">
                              <span className="menu_item_icon"><UserOutlined/></span>
                              <span>Пользователи</span>
                          </NavLink>
                      </li>
                      <li>
                          <NavLink
                              className="menu_item"
                              activeClassName="active"
                              to="/admin/notification">
                              <span className="menu_item_icon"><SoundOutlined/></span>
                              <span>Оповещение</span>
                          </NavLink>
                      </li>
                     {/*<li>*/}
                     {/*     <NavLink*/}
                     {/*         className="menu_item"*/}
                     {/*         activeClassName="active"*/}
                     {/*         to="/admin/monitor">*/}
                     {/*         <span className="menu_item_icon"><WifiOutlined/></span>*/}
                     {/*         <span>Мониторинг</span>*/}
                     {/*     </NavLink>*/}
                     {/* </li>*/}
                     {/* <li>*/}
                     {/*     <NavLink*/}
                     {/*         className="menu_item"*/}
                     {/*         activeClassName="active"*/}
                     {/*         to="/admin/doc">*/}
                     {/*         <span className="menu_item_icon"><FileTextOutlined /></span>*/}
                     {/*         <span>Документы</span>*/}
                     {/*     </NavLink>*/}
                     {/* </li>*/}

                  </ul>}
                  route={<Routes>
                      <Route path="/users/" element={<UsersPageContainer/>}/>
                      {/*<Route path="/doc/" element={<AdminDocumentPage/>}/>*/}
                      <Route path="/about/" element={<AboutProgramPage/>}/>
                      {/*<Route path="/glossary/" element={<GlossaryPage/>}/>*/}
                      <Route path="/user/:id" element={<UserPageContainer/>}/>
                      <Route path="/settings/" element={<SettingsPage/>}/>
                      <Route path="/notification/" element={<NotificationsPage/>}/>
                      {/*<Route path="/monitor/" element={<MonitorPage/>}/>*/}
                      <Route path="/*" element={<Navigate replace to="/admin/users"/>}/>
                  </Routes>}
                  prefix='admin'
                  current_user={current_user}
        />
    )
})

