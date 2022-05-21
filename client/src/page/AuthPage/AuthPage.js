import React from "react";
import {Button, Form, Input} from "antd";

import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import {useRootStore} from "../../store";
import {observer} from "mobx-react-lite";



export const AuthPage = observer( (props) => {

    const {current_user} = useRootStore()

    return (

        <Form name="login"
              onFinish={(value)=>current_user.login(value)}
        >
            <Form.Item
                name='email'
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста введите логин!"
                    },
                ]}
            >
                <Input
                    prefix={<UserOutlined/>}
                    type="text"
                    placeholder="Логин"
                    autoComplete='off'
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста введите пароль!"
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined/>}
                    type="password"
                    placeholder="Пароль"
                    autoComplete='off'

                />
            </Form.Item>
            <Form.Item>
                <Button
                    loading={current_user.loading}
                    type="primary"
                    htmlType="submit"
                >
                    Войти
                </Button>
            </Form.Item>
        </Form>

    );
});
