import {Button,  Form, Input, message, } from "antd";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";

import React from "react";
import {useRootStore} from "../../store";


export const ChangePasswordPage = () => {
    const {current_user} = useRootStore()

    const onSavePassword = async (value) => {
        if (value.new_password === value.repeat_password) {
            await current_user.changePassword(value)

        } else if(value.new_password === value.old_password ) {
            message.error("Старый и Новые пароли не должны совпадать!")
        } else {
            message.error("Новые пароли не совпадают!")
        }
    }

    return (

        <Form
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

    );
};
