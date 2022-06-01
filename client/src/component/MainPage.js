import React, {useEffect} from 'react';
import {Link, Navigate, NavLink, Route, Routes} from 'react-router-dom';
import {Badge, Button, Dropdown, Menu, message, Popover, Tabs, Tag} from "antd";

import "../auth.css";
import "../app.css";
import '../index.css';
import logo from '../asset/img/gerb.png'
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import ExportOutlined from "@ant-design/icons/lib/icons/ExportOutlined";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import { observer} from "mobx-react-lite";
import {useRootStore} from "../store";
import {Loader} from "./Loader";
import {Notification} from "./Notification/Notification";
import {NoAccessPage} from "../page/NoAccessPage/noAccessPage";
import {ChangePasswordPage} from "../page/СhangePasswordPage/changePasswordPage";
import {AuthPage} from "../page/AuthPage/AuthPage";
import {RegisterPage} from "../page/RegisterPage/RegisterPage";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";
import Downloader from "./Downloader/Downloader";
import {getColorNum} from "../asset/utils/utils";
import ArrowUpOutlined from "@ant-design/icons/lib/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/lib/icons/ArrowDownOutlined";
import SwapOutlined from "@ant-design/icons/lib/icons/SwapOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import RiseOutlined from "@ant-design/icons/lib/icons/RiseOutlined";
import FallOutlined from "@ant-design/icons/lib/icons/FallOutlined";

const { TabPane } = Tabs;

export const MainPage = observer(({service, title, menu, route, prefix, current_user}) => {

    const {notification, system} = useRootStore()
    const {user, initialized, isAuth, isReset} = current_user
    const {info} = notification







    useEffect(async () => {
        await current_user.initializedApp();
    }, []);


    useEffect(() => {

        if (info.message) {
            if (info.status === 'success') message.success(info.message);
            if (info.status === 'error') message.error(info.message);
            if (info.status === 'info') message.info(info.message);
        }

    }, [info])


    useEffect( async () => {
        await system.getIndex()

        const timer = setInterval(() => {
              system.getIndex()
            return ()=> clearInterval(timer)
        }, 30000);

    }, [])




    if (!initialized) {
        return <Loader/>
    }

   // let indx =  system.index.filter(item=>item.rootSymbol==="XBT")


    let tabs = system.index.map((item, index)=> <TabPane tab={ <Popover
        content={<div>
            <p><RiseOutlined style={{color: "green"}}/> {item.highPrice}</p>
            <p><FallOutlined style={{color: "red"}}/> {item.lowPrice}</p>
            <p><SwapOutlined style={{color: "blue"}}/> {item.lastPrice}</p>
        </div>
        } title={item.symbol}
        trigger="hover"><Tag><b>{item.rootSymbol}</b> {(item.lastPrice).toFixed(2)} {getColorNum((((item.lastPrice - item.prevPrice24h) / item.prevPrice24h) * 100).toFixed(2), '%')}
    </Tag> </Popover>} key={index}>
        {item.tikets.map(jtem=> {

            if(jtem.highPrice && jtem.lowPrice && jtem.lastPrice ){
                return (
                    <Popover
                        content={<div>
                            <p><RiseOutlined style={{color: "green"}}/> {jtem.highPrice}</p>
                            <p><FallOutlined style={{color: "red"}}/> {jtem.lowPrice}</p>
                            <p><SwapOutlined style={{color: "blue"}}/> {jtem.lastPrice}</p>
                        </div>
                        } title={jtem.symbol}
                        trigger="hover"><Tag><b>{jtem.symbol}</b> {(jtem.lastPrice).toFixed(2)} {getColorNum((((jtem.lastPrice - jtem.prevPrice24h) / jtem.prevPrice24h) * 100).toFixed(2), '%')}
                    </Tag> </Popover>
                )
            }
        }   )}
    </TabPane>)



   // let defaultActiveKey = String(system.index.findIndex((item=> item.rootSymbol==="XBT")))

  //  console.log(defaultActiveKey)

    return (
        isAuth && user.access_services && user.access_services.map(item=> item.service).includes(service) ?
            <div className="wrapper">
                <header>
                        <Tabs
                            defaultActiveKey={system.defaultActiveKey}
                            size='small'
                            type="card">
                            {tabs}
                        </Tabs>


                        {/*{system.index.map(item=> {*/}

                        {/*    if(item.highPrice && item.lowPrice && item.lastPrice ){*/}
                        {/*        return (*/}
                        {/*            <Popover*/}
                        {/*                content={<div>*/}
                        {/*                    <p><RiseOutlined style={{color: "green"}}/> {item.highPrice}</p>*/}
                        {/*                    <p><FallOutlined style={{color: "red"}}/> {item.lowPrice}</p>*/}
                        {/*                    <p><SwapOutlined style={{color: "blue"}}/> {item.lastPrice}</p>*/}
                        {/*                </div>*/}
                        {/*                } title={item.symbol}*/}
                        {/*                trigger="hover"><Tag><b>{item.symbol}</b> {(item.lastPrice).toFixed(2)} {getColorNum((((item.lastPrice - item.prevPrice24h) / item.prevPrice24h) * 100).toFixed(2), '%')}*/}
                        {/*            </Tag> </Popover>*/}
                        {/*        )*/}
                        {/*    }*/}


                        {/*    }*/}
                        {/*)}*/}


                    <div className="profileMenu">
                        <Button className='mr10' onClick={()=> system.getIndex()}>{!system.loading ? <ReloadOutlined  /> : <LoadingOutlined /> }</Button>
                        <Notification data={current_user.notification} onSee={(arr) => current_user.seen(arr)}
                                      className='mr10'/>
                        <span className="mr10">{user.role}:</span>
                        <Dropdown
                            ttrigger={["click"]}
                            overlay={
                                <Menu>
                                    <NavLink
                                        to={`/${prefix}/settings`}>
                                        <Menu.Item key="1" icon={<UserOutlined/>}>
                                            Настройки
                                        </Menu.Item>
                                    </NavLink>
                                    <NavLink
                                        to={`/${prefix}/about`}>
                                        <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
                                            О приложении
                                        </Menu.Item>
                                    </NavLink>
                                    <Menu.Item onClick={() => current_user.logout()} key="2" icon={<ExportOutlined/>}>
                                        Выйти
                                    </Menu.Item>
                                </Menu>}
                            placement="bottomRight"
                        >
                            <Button>
                                {user.family} <DownOutlined/>
                            </Button>

                        </Dropdown>
                    </div>
                </header>
                <aside>
                    <div className="menu_header">
                        <div className="menu_title">
                            <div className="menu_title_name">{title}</div>
                        </div>
                        <Link  to="/">
                            <div className="menu_logo">
                                <img src={logo} alt="logo"/>
                            </div>
                        </Link>

                    </div>
                    {menu}
                </aside>
                <article>
                    {route}
                </article>
                {system.filesDownloader.length> 0 && <Downloader files={system.filesDownloader}
                                                                 remove={(e) => system.removeFilesBar(e)}
                                                                 setInfo={(status, message) => notification.setInfo(status, message)}
                />}
                <footer>
                    ©2022
                </footer>
            </div>
            :
            <div className="bg_img">
                <div className="bg">
                    {user.access_services && !user.access_services.map(item => item.service).includes(service) ?

                        <Routes>
                            <Route path="/noaccess" element={<NoAccessPage/>}/>
                            <Route path="/*" end element={<Navigate replace to={`/${prefix}/noaccess`}/>}/>
                        </Routes>
                        :

                        <div className="authBox">
                            <div className="card">
                                <div className="login_head">
                                    <NavLink className="login_head__item" activeClassName="active"
                                             to={`/${prefix}/auth`}>Вход</NavLink>
                                    <NavLink className="login_head__item" activeClassName="active"
                                             to={`/${prefix}/register`}>Регистрация</NavLink>

                                </div>
                                <div className="form">
                                    {isReset ?
                                        <Routes>
                                            <Route path="/reset" element={<ChangePasswordPage/>}/>
                                            <Route path="/*" end element={<Navigate replace to={`/${prefix}/reset`}/>}/>
                                        </Routes>
                                        :
                                        <Routes>
                                            <Route path="/auth" element={<AuthPage/>}/>
                                            <Route path="/register" element={<RegisterPage/>}/>
                                            <Route path="/*" end element={<Navigate replace to={`/${prefix}/auth`}/>}/>
                                        </Routes>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
    );
})
