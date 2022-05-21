import React, {useEffect, useState} from "react";
import {MaskedInput} from "antd-mask-input";

import "./docum.css"

import {observer} from "mobx-react-lite";
import {Button, DatePicker, Form, Input, Result, Select, Space, Table, Tabs, Tooltip, Upload} from "antd";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import {useRootStore} from "../../store";
import {Loader} from "../../component/Loader";
import {DebounceSelect} from "../../component/DebounceSelect";


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


    const {current_user} = useRootStore()









    return (
        <>
            <div className="title">Главная</div>
            <div className="content">
            Главная страница

            </div>
        </>

    );

});
