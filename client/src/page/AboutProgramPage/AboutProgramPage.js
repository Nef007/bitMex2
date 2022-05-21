import React, {useEffect} from "react";
import {Button, DatePicker, Form, Input, Modal, Space, Table, Tooltip} from "antd";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../../store";
import _ from "lodash";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import moment from "moment"
import {useToggle} from "react-use";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";


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

export const AboutProgramPage = observer(props => {


    const {system, current_user} = useRootStore()

    useEffect(async () => {
        await system.getAllVersion()
    }, [])

    const columns = [

        {
            title: "Версия",
            dataIndex: "version",
            width: 110,
            className: "vertical-align-top"

        }, {
            title: "Дата",
            dataIndex: "date",
            render: (text) => text && moment(text).format("DD.MM.YYYY"),
            width: 110,
            className: "vertical-align-top"

        },
        {
            title: "Описание",
            dataIndex: "description",
            className: "vertical-align-top",
            render: (text) =>
                <div className="text_table">
                    {text}
                </div>,

        },
        {
            title: "",
            width: 110,
            className: "vertical-align-top",
            render: (record) => (
                current_user.user.role === 'Администратор' &&
                <>
                    <Space size="middle">
                        <Tooltip title="Редактировать">
                            <Button shape="circle"
                                    icon={<EditOutlined/>}
                                    onClick={() => onEdit(record.id)}
                                    size="large"/>
                        </Tooltip>
                        <Tooltip title="Удалить">
                            <Button onClick={() => onDelete(record.id)} shape="circle"
                                    icon={<DeleteOutlined/>}
                                    size="large"/>
                        </Tooltip>
                    </Space>


                </>

            ),

        },]
    const [activeVersionAddedModal, setActiveVersionAddedModal] = useToggle(false)


    const [form] = Form.useForm();

    const onDelete = async (id) => {

        Modal.confirm({
            title: 'Вы действительно хотите удалить запись?',
            icon: <ExclamationCircleOutlined/>,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                system.deleteVersion(id)
            },
        });
    };


    const onEdit = async (id) => {
        await system.getVersionIndex(id)
        form.setFieldsValue({...system.version, date: moment(system.version.date)})
        setActiveVersionAddedModal()

    };
    const onCancel = () => {
        system.cleanVersion()
        form.resetFields();
        setActiveVersionAddedModal()


    };


    const onSaveForm = async () => {
        const value = await form.validateFields()
        if (_.isEmpty(system.version)) {
            await system.createVersion(value)
        } else system.changeVersion(system.version.id, value)

    }


    return (

        <>
            <div className="title">О приложении</div>
            <div className="contentOut">


                <Table scroll={{x: 415}}
                       size="small"
                       rowKey={record => record.id}
                       loading={system.loading}
                       columns={columns}
                       dataSource={system.allVersions}
                       title={() => (
                           current_user.user.role === 'Администратор' &&
                           <div className="table_header">
                               <div>
                                   <Button className="btn" onClick={() => setActiveVersionAddedModal()} type="primary">
                                       <PlusOutlined/> Добавить
                                   </Button>
                               </div>

                           </div>

                       )}

                />


                <Modal
                    title="Добавить запись"
                    visible={activeVersionAddedModal}
                    onCancel={onCancel}


                    footer={[
                        <Button key="submit" type="primary" onClick={() => onSaveForm()}>
                            {_.isEmpty(system.version) ? "Добавить" : "Изменить"}
                        </Button>,

                    ]}

                >

                    <Form
                        {...formItemLayout}
                        form={form}

                    >
                        <Form.Item
                            label="Версия"
                            name="version"

                            rules={[{required: true, message: ''}]}
                        >
                            <Input placeholder="0.0.0"/>
                        </Form.Item>
                        <Form.Item name="date"
                                   label="Дата"
                                   rules={[{required: true, message: ''}]}
                        >
                            <DatePicker
                                format={'DD.MM.YYYY'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Описание"
                            name="description"
                            rules={[{required: true, message: ''}]}
                        >
                            <Input.TextArea placeholder="Введите описание..."/>
                        </Form.Item>

                    </Form>

                </Modal>
            </div>

        </>

    );
})
