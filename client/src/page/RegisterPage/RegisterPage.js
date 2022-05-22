import {Button, Form, Input, Select} from "antd";
import React, {useEffect} from "react";
import {useRootStore} from "../../store";
import {DebounceSelect} from "../../component/DebounceSelect";
import {observer} from "mobx-react-lite";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";

export const RegisterPage = observer(() => {
    const {current_user} = useRootStore()



    return (

        <Form
            name="register"
            onFinish={(value) => current_user.register("new", value)}
        >
            <Form.Item
                name="family"
                rules={[{required: true, message: ""}]}
            >
                <Input

                    type="text"
                    name="family"
                    placeholder="Фамилия"
                />
            </Form.Item>

            <Form.Item
                name="name"
                rules={[{required: true, message: ""}]}>
                <Input

                    type="text"
                    name="name"
                    placeholder="Имя"
                />
            </Form.Item>
            <Form.Item
                name="patronymic"
                rules={[{required: true, message: ""}]}
            >
                <Input
                    type="text"
                    name="patronymic"
                    placeholder="Отчество"
                />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[{required: true, message: ''}]}
            >
                <Input

                    type="text"
                    name="email"
                    placeholder="Email"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{required:true , message: '', min: 5}]}
            >
                <Input
                    prefix={
                        <LockOutlined/>
                    }
                    type="text"
                    placeholder="Пароль"

                />

            </Form.Item>

            <Form.Item
                name="phone"
                rules={[{required: true, message: '', len: 10}]}
            >
                <Input addonBefore="+7" type="text" maxLength={10} placeholder="Телефон"/>
            </Form.Item>

            <Form.Item
                name="role"
                rules={[{required: true, message: ''}]}
            >
                <Select  placeholder="Выберите значение">
                    <Select.Option value="Пользователь">Пользователь</Select.Option>
                    <Select.Option value="Администратор">Администратор</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    Регистрация
                </Button>
            </Form.Item>
        </Form>

    );
});
