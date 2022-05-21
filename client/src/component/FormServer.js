
import React, {useEffect} from "react";
import {Button, Form, Input, Modal, Select} from "antd";

import {Observer, observer} from "mobx-react-lite";
import {useRootStore} from "../store";


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 9},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
    },
};

const tailLayout = {
    wrapperCol: {span: 24},
};



export const FormServer = observer( ({onSaveForm,  setValueType, valueType }) => {

    const {servers} = useRootStore()

    return (

        <Observer>{() =>

            <Form
                {...formItemLayout}

                onFinish={onSaveForm}
            >
                <Form.Item
                    label="IP"
                    name="ip"
                    initialValue={servers.server.ip}
                    rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="ip станции"/>
                </Form.Item>
                <Form.Item
                    label="Адрес"
                    name="connect"
                    rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="Введите адрес"/>
                </Form.Item>
                <Form.Item
                    label="Название"
                    name="name"
                    rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="Введите"/>
                </Form.Item>
                <Form.Item
                    label="FecName"
                    name="fecname"
                    rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="Введите"/>
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="sendmail"
                    rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="test1@mail.ru, test2@mail.ru"/>
                </Form.Item>
                <Form.Item
                    label="Тип"
                    name="type"
                    rules={[{required: true, message: ''}]}
                >
                    <Select
                        style={{width: 200}}
                        placeholder="Выберите"
                        onChange={setValueType}

                    >
                        <Select.Option value="web">WEB</Select.Option>
                        <Select.Option value="бд">БД</Select.Option>

                    </Select>
                </Form.Item>
                {valueType === "бд" &&
                <>
                    <Form.Item
                        label="Логин"
                        name="login"
                        rules={[{required: true, message: ''}]}
                    >
                        <Input placeholder="Введите"/>
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{required: true, message: ''}]}
                    >
                        <Input placeholder="Введите"/>
                    </Form.Item>
                </>
                }
                {(valueType === "web" || valueType === "WEB"  ) &&
                <>
                    <Form.Item
                        label="Ключевое слово"
                        name="keyword"
                        rules={[{required: true, message: ''}]}
                    >
                        <Input placeholder="Введите слово на сайте"/>
                    </Form.Item>

                </>
                }


                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Добавить
                    </Button>

                </Form.Item>
            </Form>

        }</Observer>


    );
});
