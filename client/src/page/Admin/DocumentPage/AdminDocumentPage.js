import React, {useEffect, useState} from "react";
import {useToggle} from "react-use";
import {Avatar, Button, Form, Input, List, Modal, Progress, Select, Space, Table, Tooltip, Typography} from "antd";
import notifi from "../../../asset/img/notifi.png";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import {useRootStore} from "../../../store";
import {observer} from "mobx-react-lite";
import moment from "moment"

import {DebounceSelect} from "../../../component/DebounceSelect";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import FileSearchOutlined from "@ant-design/icons/lib/icons/FileSearchOutlined";



export const AdminDocumentPage = observer(() => {


    const { documents} = useRootStore()



    useEffect(async ()=>{
        await documents.allDuples();

    },[])

    //
    // const data = [{
    //     createdAt: '05.04.2022',
    //     file_name: '05.04.2022_fduples_rezult.txt',
    //     count_repite: 256
    // },{
    //     createdAt: '05.04.2022',
    //     file_name: '05.04.2022_fduples_rezult.txt',
    //     count_repite: 256
    // },{
    //     createdAt: '05.04.2022',
    //     file_name: '05.04.2022_fduples_rezult.txt',
    //     count_repite: 256
    // }]



    const columns = [

        {
            title: "Дата запуска",
            dataIndex: "createdAt",
           // width: 110,
            render: (text) => text && moment(text).format("DD.MM.YYYY"),
          //  className: "vertical-align-top"

        }, {
            title: "Файл",
            dataIndex: "file_name",
            render: (text) => <a  href={`${window.location.origin.replace("3000", "5000")}/${text}`}>{text}</a>,
           // width: 110,
           // className: "vertical-align-top"

        },
        {
            title: "Кол-во повторов",
            dataIndex: "count_duples",
           // className: "vertical-align-top",


        },
      ]



    return (
        <>
            <div className="title">Документы</div>
            <div className="contentOut">


                <Table scroll={{x: 415}}
                       size="small"
                       rowKey={record => record.id}
                       loading={documents.loading}
                       columns={columns}
                       dataSource={documents.arrDuples}
                       title={() => (
                           <div className="table_header">
                               <div>
                                   <Button className="btn"
                                           onClick={() => documents.startDuples()}
                                           type="primary">
                                       <FileSearchOutlined /> Поиск и удаление повторов
                                   </Button>
                               </div>

                           </div>

                       )}
                />
            </div>
        </>
    );
});
