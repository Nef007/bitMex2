import React, {useEffect, useState} from "react";
import {useToggle} from "react-use";
import {Avatar, Button, Form, Input, List, Modal, Progress, Select, Space, Table, Typography} from "antd";
import notifi from "../../../asset/img/notifi.png";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import {useRootStore} from "../../../store";
import {observer} from "mobx-react-lite";
import moment from "moment"

import {DebounceSelect} from "../../../component/DebounceSelect";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";

const {Text} = Typography;
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
const tailLayout = {
    wrapperCol: {offset: 6, span: 16},
};


export const NotificationsPage = observer(() => {

    const {notification} = useRootStore()

    useEffect(async () => {
        await notification.getNotifis()
    }, [])


    const [activeNotifiModal, setActiveNotifiAddedModal] = useToggle(false)



    //////////////////////////////////ПОИСК///////
    let searchInput = React.createRef()
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)

    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };
    const getColumnSearchProps = dataIndex => ({

        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Что искать?`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Поиск
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Сброс
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const columns = [
        {
            title: "Фамилия",
            dataIndex: "family",
            ...getColumnSearchProps('family'),

        },

        {
            title: "Имя",
            dataIndex: "name",
            ...getColumnSearchProps('name'),

        },
         {
            title: "Email",
            dataIndex: "email",

        }, {
            title: "Просмотрено",

            render: (record) => {
                return (record.notifications[0].user_notifi.seen ?
                    <CheckCircleOutlined style={{fontSize: '16px', color: '#2d8d1c'}}/> :
                    <CloseCircleOutlined style={{fontSize: '16px', color: '#a10934'}}/>)
            }

        }, {
            title: "Дата",
            defaultSortOrder: 'descend',
            render: (record) => moment(record.notifications[0].user_notifi.updatedAt).format('HH:mm DD.MM.YYYY'),
            sorter: (a, b) => new Date(a.notifications[0].user_notifi.updatedAt) - new Date(b.notifications[0].user_notifi.updatedAt),

        },

    ]


    const onDeleteNotifi = (id) => {


        Modal.confirm({
            title: 'Удалить оповещение?',
            icon: <ExclamationCircleOutlined/>,
            // content: 'Some descriptions',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                notification.delete(id)
            },
        });
    };
    const onSaveForm = (value) => {
        notification.create(value)
        setActiveNotifiAddedModal()
    }
    const onShowListUser = async (e, id) => {
        if (e.target.innerText === "Показать список") {
            await notification.getUsers(id)
        } else {
            notification.cleanUsersInfo(id)
        }
    }


    return (

        <>
            <div className="title">Оповещения</div>
            <div className="content">
                <div className="w100">
                    <List
                        loading={notification.loading}
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 4,
                        }}
                        dataSource={notification.all}
                        header={

                            <div className="table_header">
                                <span>Всего: {notification.all.length}</span>
                                <Button onClick={setActiveNotifiAddedModal} type="primary">
                                    <PlusOutlined/> Добавить
                                </Button>
                            </div>
                        }

                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                actions={[
                                    <Button onClick={(e) => onShowListUser(e, item.id)}
                                            type="primary">{item.users.length > 0 ? "Скрыть список" : "Показать список"}</Button>,
                                    <Button onClick={() => onDeleteNotifi(item.id)} danger>Удалить</Button>

                                ]}
                                extra={
                                    <Progress type="circle" percent={Math.round(item.count_seen * 100 / item.count)}/>
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={50} src={notifi}/>}
                                    title={`Оповещение № ${item.id}`}
                                    description={<div className='description'>
                                    <span>
                                         <div>Создал: {item.owner}</div>
                                        <div>Группа: {item.group}</div>
                                        <div>{item.user}</div>

                                    </span>
                                        <span className="time">
                                        <Text
                                            type="secondary">Создано: {moment(item.createdAt).format('HH:mm DD.MM.YYYY')}</Text>
                                        <Text type="secondary">Просмотрели: {item.count_seen}/{item.count}</Text>

                                </span>

                                    </div>}
                                />
                                <p>{item.content}</p>
                                <div>
                                    {item.users.length > 0 && <Table scroll={{x: 900}}
                                                                     loading={notification.loading}
                                                                     size="small"
                                                                     rowKey={record => record.id}

                                                                     columns={columns}
                                                                     dataSource={item.users}

                                    />}

                                </div>
                            </List.Item>
                        )}
                    />
                </div>
                <Modal
                    title="Добавить оповещение"
                    visible={activeNotifiModal}
                    footer={null}
                    onCancel={setActiveNotifiAddedModal}

                >

                    <Form
                        {...formItemLayout}
                        onFinish={onSaveForm}
                    >
                        <Form.Item
                            label="Группа"
                            name="group"
                            rules={[{required: true, message: ''}]}
                        >
                            <Select
                                style={{width: 200}}
                                placeholder="Выберите"
                            >
                                <Select.Option value="Все">Все</Select.Option>
                                <Select.Option value="Администратор">Администратор</Select.Option>
                                <Select.Option value="Пользователь">Пользователь</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Сообщение"
                            name="content"
                            rules={[{required: true, message: ''}]}
                        >
                            <Input.TextArea placeholder="Введите текст"/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Добавить
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
});
