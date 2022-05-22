import React, {useEffect} from "react";

import {observer} from "mobx-react-lite";
import {Button, Form, InputNumber} from "antd";
import {useRootStore} from "../../../store";



const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};


export const SettingsAppPage = observer(props => {

    const {system} = useRootStore()

    useEffect(async () => {
        await   system.getTimeUpdate()
    }, []);


    const onSetTime = (form) => {
        system.setTimeUpdate(form)


    }


    return (

        <>
            <div className="title">Настройки</div>
            <div className="contentOut">
                <h2> Частота обновления</h2>
                <Form

                    name="time"
                    labelCol={{span: 11}}
                    wrapperCol={{span: 5}}
                    initialValues={{timeupdate: system.timeupdate}}
                    onFinish={onSetTime}

                >
                    <Form.Item
                        label="Частота(минуты)"
                        name="timeupdate"
                        rules={[{required: true, message: 'Введите время!'}]}
                    >
                        <InputNumber min={5}/>

                    </Form.Item>
                    <div className="center">
                        <div>
                            <div>1 час = 60 минут</div>
                            <div>1 день = 1440 минут</div>
                        </div>

                    </div>


                    <Form.Item wrapperCol={{offset: 11, span: 5}}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>


            </div>


        </>

    );
});
