import React, {useEffect, useState} from "react";

import {Button, Form, Input, message, Select, Skeleton, Space, Steps, Table, Tag, Tooltip} from "antd";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import {FormUser} from "../../component/FormUser";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../../store";
import {Loader} from "../../component/Loader";
import moment from "moment"
import {isEmpty} from "lodash";



const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 9},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
    },
};

export const SettingsPage = observer(props => {


    const {current_user, users} = useRootStore()
    const {index_user: user} = users

    useEffect(async () => {
        await users.getUser(current_user.user.id)
        users.getLogs(current_user.user.id)
    }, [])







    const onSaveFormData = async (value) => {
        await users.changeUser(user.id, value)
    }
    const onSavePerson = async (value) => {
        const setting = JSON.parse(JSON.stringify(value))

        if (!isEmpty(setting)) {
            await users.changeSetting(current_user.user.id, setting)
        }


    }
    const onSavePassword = async (value) => {
        if (value.new_password === value.repeat_password) {
            await current_user.changePassword(value)
        } else if (value.new_password === value.old_password) {
            message.error("Старый и Новые пароли не должны совпадать!")
        } else {
            message.error("Новые пароли не совпадают!")
        }
    }


    if (users.loading || !users.index_user) {
        return <Loader/>
    }

    return (

        <>
            <div className="title">Настройки</div>
            <div className="content">
                <div className="section">
                    <div className="info_user">
                        <div className="title">Данные</div>
                        <FormUser
                            onSaveForm={onSaveFormData}
                            user={user}

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
                            {/*<div className="row between">*/}
                            {/*    <div className="col">*/}
                            {/*        На оценке:*/}
                            {/*    </div>*/}
                            {/*    <div className="col">*/}
                            {/*        {user.dataInfo.startState.estimates}*/}
                            {/*    </div>*/}
                            {/*</div>*/}
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
                        {/*<div className='block_user'>*/}
                        {/*    <div className="title">События</div>*/}
                        {/*    <div className='steps_block'>*/}
                        {/*        <Steps className="steps" progressDot current={0} direction="vertical">*/}
                        {/*            {user.logs.map(log =>*/}
                        {/*                <Steps.Step*/}
                        {/*                    title={*/}

                        {/*                        <div className="text_table">*/}
                        {/*                            {  log.text}*/}
                        {/*                        </div>*/}

                        {/*                    }*/}
                        {/*                    description={moment(log.createdAt).format("HH:mm DD.MM.YYYY")}/>*/}
                        {/*            )}*/}
                        {/*        </Steps>*/}

                        {/*    </div>*/}

                        {/*</div>*/}
                        <div className='block_user'>
                            <div className="header_block">
                                <div className="title">События</div>
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
                    <div className='info_user'>
                        <div className="title">Изменить пароль</div>
                        <Form   {...formItemLayout}
                                onFinish={onSavePassword}
                        >
                            <Form.Item
                                label="Старый пароль"
                                name="old_password"
                                rules={[{required: true, message: ''}]}
                                initialValue={''}

                            >
                                <Input

                                    prefix={
                                        <LockOutlined/>
                                    }

                                    type="text"
                                    placeholder="******"

                                />
                            </Form.Item>
                            <Form.Item label="Новый пароль"
                                       name="new_password"
                                       rules={[{required: true, message: 'минимум 5 символов', min: 5}]}

                            >
                                <Input
                                    prefix={
                                        <LockOutlined/>
                                    }
                                    type="text"
                                    placeholder="******"

                                />
                            </Form.Item>
                            <Form.Item label="Повтор пароля"
                                       name="repeat_password"
                                       rules={[{required: true, message: 'минимум 5 символов', min: 5}]}

                            >
                                <Input
                                    prefix={
                                        <LockOutlined/>
                                    }
                                    type="text"
                                    placeholder="******"

                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Изменить
                                </Button>
                            </Form.Item>

                        </Form>
                    </div>
                    <div className='info_user'>
                        <div className="title">Персонализация</div>
                        <Form
                            onFinish={onSavePerson}
                        >
                            <Form.Item
                                label="Звук"
                                name="sound"
                            >
                                <Select defaultValue={user.setting.sound}>
                                    <Select.Option value="droid">Дроид</Select.Option>
                                    <Select.Option value="signalizatsiya">Сигнализация</Select.Option>
                                    <Select.Option value="kaplya">Капля</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Тема"
                                name="theme"
                            >
                                <Select defaultValue={user.setting.theme}>

                                    <Select.Option value="light">Светлая</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Сохранить
                                </Button>
                            </Form.Item>

                        </Form>


                    </div>
                </div>

            </div>
        </>

    );
})
