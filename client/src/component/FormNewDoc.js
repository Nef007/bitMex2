
import React, {useEffect} from "react";
import {Button, DatePicker, Form, Input, Modal, Select} from "antd";

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



export const FormNewDoc = observer( ({activeModalDataFile,  onCancelModalDataFile, onSaveFormDataFile }) => {



    return (

        <Modal title="Заполните поля"
               visible={activeModalDataFile}
               onCancel={onCancelModalDataFile}
               footer={null}
        >
            <Form {...formItemLayout} onFinish={onSaveFormDataFile}>
                <Form.Item name="title"
                           label="Название"
                           rules={[{required: true, message: ''}]}
                >
                    <Input placeholder="Уд,Запрос" maxlength={27}/>
                </Form.Item>
                <Form.Item name="number"
                           label="Номер"
                           rules={[{required: true, message: ''}]}
                >
                    <Input  placeholder="123456"/>
                </Form.Item>
                <Form.Item name="date"
                           label="Дата"
                           rules={[{required: true, message: ''}]}


                >
                    <DatePicker
                        format={'DD.MM.YYYY'}
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button htmlType="submit" type="primary">Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});
