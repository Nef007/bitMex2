
import React, {useEffect} from "react";
import {Button, Checkbox, Form, Input, Select} from "antd";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";
import {observer} from "mobx-react-lite";



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



export const FormUser = observer( ({onDeleteUser, deleteBtn=true, password, onSaveForm, user={}, onBuildPassword, isAdmin=false, }) => {


    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            password: password,
        });
    }, [password,form]);


    return (

            <Form
                {...formItemLayout}
                form={form}
                onFinish={onSaveForm}

            >
                <Form.Item
                    label="Фамилия"
                    name="family"
                    initialValue={user.family}
                    rules={[{required: true , message: '',}]}
                >
                    <Input
                        disabled={!isAdmin}
                        type="text"
                        placeholder="Фамилия"

                    />
                </Form.Item>
                <Form.Item label="Имя"
                           name="name"
                           initialValue={user.name}
                           rules={[{required: true , message: '',}]}
                >
                    <Input  disabled={!isAdmin} type="text" placeholder="Имя"/>
                </Form.Item>
                <Form.Item label="Отчество"
                           name="patronymic"
                           initialValue={user.patronymic}
                           rules={[{required: true , message: '',}]}
                >
                    <Input  disabled={!isAdmin} type="text" placeholder="Отчество"/>
                </Form.Item>





                <Form.Item label="Телефон"
                           name="phone"
                           initialValue={user.phone}
                           rules={[{ required: true, message: "" }]}
                >
                    <Input addonBefore="+7" type="text" maxLength={10} placeholder="Телефон"/>
                </Form.Item>

                <Form.Item
                    label="Роль"
                    name="role"
                    initialValue={user.role}
                    rules={[{required: true , message: '',}]}
                >
                    <Select  disabled={!isAdmin}>
                        <Select.Option value="Пользователь">Пользователь</Select.Option>
                        <Select.Option value="Администратор">Администратор</Select.Option>
                    </Select>
                </Form.Item>
                {isAdmin && <Form.Item
                    label="Статус"
                    name="status"
                    initialValue={user.status}
                    rules={[{required: true , message: '',}]}
                >
                    <Select
                        //style={{width: 200}}
                        placeholder="Статус"
                    >
                        <Select.Option value="Временный">Временный</Select.Option>
                        <Select.Option value="Активный">Активный</Select.Option>
                        <Select.Option value="Блокирован">Блокирован</Select.Option>
                    </Select>
                </Form.Item> }

                <Form.Item
                    label="Логин"
                    name="email"
                    initialValue={user.email}
                    rules={[{required: true , message: '',}]}
                >
                    <Input
                        disabled={!isAdmin}
                        prefix={
                            <UserOutlined/>
                        }
                        type="text"
                        placeholder="Логин"
                    />
                </Form.Item>

                {isAdmin &&  <Form.Item
                    label="Пароль"
                    name="password"
                    initialValue={password}
                    rules={[{required: !isAdmin , message: '', min: 5}]}
                >
                    <Input
                        prefix={
                            <LockOutlined/>
                        }
                        addonAfter={<RedoOutlined
                            style={{fontSize: "20px"}}
                            onClick={onBuildPassword}
                        />}
                        type="text"
                        placeholder="Пароль"

                    />

                </Form.Item>}


                <Form.Item {...tailLayout}>
                    <div className={(isAdmin && deleteBtn) ?  "between" : "center"}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                        {(isAdmin && deleteBtn) && <Button onClick={onDeleteUser} danger  >
                            Удалить
                        </Button> }

                    </div>


                </Form.Item>
            </Form>


    );
});
