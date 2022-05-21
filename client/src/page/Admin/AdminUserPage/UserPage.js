import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, Modal, Select, Skeleton, Space, Steps, Table, Tag, Tooltip} from "antd";

import './user.css'
import {FormUser} from "../../../component/FormUser";
import moment from "moment";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import {useToggle} from "react-use";
import {DebounceSelect} from "../../../component/DebounceSelect";
import {observer} from "mobx-react-lite";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import {Loader} from "../../../component/Loader";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";


export const UserPage = observer((props) => {


    const {
        password,
        onBuildPassword,
        onChangeUser,
        onDeleteUser,
        user,
        linkId,
        users,
        system
    } = props


    // const {users} = useRootStore()


    const [form] = Form.useForm();
    const [formAccess] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            password: password,
        });
    }, [password, form]);


    const [activeModalService, setActiveModalService] = useToggle(false)
    const [arrayDeleteHeaderService, setArrayDeleteHeaderService] = useState([])

    const columnsHeaderAccess = [

        {
            title: "Сервис",
            dataIndex: "service",

        },
    ]

    const rowSelectionHeader = {
        onChange: (selectedRowKeys, selectedRows) => {
            setArrayDeleteHeaderService(selectedRowKeys)
        },
    };

    const onDeleteAccessServiceService = async () => {
        await users.deleteAccessService(user.id, arrayDeleteHeaderService)

    }

    const onSaveFormAccessServiceService = async (value) => {
        setActiveModalService()
        await users.createAccessService(user.id, value)
    }





    const getLogsFile = () => {

        system.downloadFileBar({name: `logs_user_id_${linkId}.txt` , path: `/user/logs_file/${linkId}` , fileName: `logs_user_id_${linkId}.txt` })
    }


    return (

        <>
            <div className="title">Пользователь № {linkId}</div>
            <div className="content">
                {(users.loading || !users.index_user) ?
                    <Loader/>
                    :
                    <>
                        <div className="section">
                            <div className="info_user">
                                <div className="title">Данные</div>

                                <FormUser onDeleteUser={onDeleteUser}
                                          password={password}
                                          onSaveForm={onChangeUser}
                                          user={user}
                                          onBuildPassword={onBuildPassword}
                                          isAdmin

                                />
                            </div>
                            <div>
                                <div className='block_user'>
                                    <div className="title">История</div>
                                    <div className="row between">
                                        <div className="col">
                                            Был в сети:
                                        </div>
                                        <div className="col">
                                            {user.last_seen ? moment(+user.last_seen).startOf('minute').fromNow() : "Никогда"}
                                        </div>
                                    </div>

                                    <div className="row between">
                                        <div className="col">
                                            Аккаунтов:
                                        </div>
                                        <div className="col">
                                           5
                                        </div>
                                    </div>
                                    <div className="row between">
                                        <div className="col">
                                            Статус:
                                        </div>
                                        <div className="col">
                                            <Tag
                                                color={user.status === "Активный" ? "green" : user.status === "Временный" ? "gold" : user.status === "Новый" ? "blue" : "red"}>
                                                {user.status}
                                            </Tag>

                                        </div>
                                    </div>
                                </div>
                                <div className='block_user'>
                                    <div className="header_block">
                                        <div className="title">События</div>
                                        <div className='tools_bar'>
                                            <Tooltip title="Обновить">
                                                <Button onClick={() => users.getLogs(linkId)} icon={<ReloadOutlined/>}
                                                        size='small'/>
                                            </Tooltip>
                                            <Tooltip title="Загрузить">
                                                <Button onClick={() => getLogsFile(linkId)}
                                                        icon={<DownloadOutlined/>} size='small'/>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className='steps_block'>

                                        {(!users.loading_Logs && user.logs) ?
                                            <Steps className="steps" progressDot current={0} direction="vertical">
                                                {user.logs.map(log =>
                                                    <Steps.Step
                                                        title={

                                                            <div className="text_table">
                                                                {log.text}
                                                            </div>

                                                        }
                                                        description={moment(log.createdAt).format("HH:mm DD.MM.YYYY")}/>
                                                )
                                                }
                                            </Steps> :
                                            <Skeleton active paragraph={{rows: 20}}/>

                                        }

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="info_user">
                                <div className="title">Доступ к сервисам</div>
                                <Table scroll={{x: 415, y: 300}}
                                       size="small"
                                       rowKey={record => record.id}
                                       loading={users.loading_AccessService}
                                       columns={columnsHeaderAccess}
                                       dataSource={user.access_services}
                                       rowSelection={{
                                           type: "checkbox",
                                           ...rowSelectionHeader,
                                       }}
                                       title={() =>
                                           <div className="table_header">

                                               <Button onClick={setActiveModalService} type="primary">
                                                   <PlusOutlined/> Добавить
                                               </Button>
                                               <Button onClick={onDeleteAccessServiceService} danger>
                                                   Удалить
                                               </Button>
                                           </div>
                                       }
                                />
                                <Modal title="Заполните поля"
                                       visible={activeModalService}
                                       onCancel={setActiveModalService}
                                       footer={null}
                                >
                                    <Form
                                        form={formAccess}
                                        layout="vertical"
                                        onFinish={onSaveFormAccessServiceService}
                                    >


                                        <Form.Item name="header_access"
                                                   label="Сервис"
                                                   rules={[{required: true, message: ''}]}
                                        >
                                            <Select
                                                mode={"multiple" }
                                                allowClear={true}
                                                placeholder="Выберите значение" >
                                                <Select.Option value="Турниры">Турниры</Select.Option>
                                                <Select.Option value="Администрирование">Администрирование</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button htmlType="submit" type="primary">Сохранить</Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        </div>

                    </>
                }
            </div>

        </>

    );
})
