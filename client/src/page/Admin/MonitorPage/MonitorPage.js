import React, {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, List, Modal, Select, Space, Table, Tabs, Tag, Tooltip} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import _ from 'lodash'
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import {useToggle} from "react-use";
import PauseOutlined from "@ant-design/icons/lib/icons/PauseOutlined";
import CaretRightOutlined from "@ant-design/icons/lib/icons/CaretRightOutlined";
import {useRootStore} from "../../../store";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import moment from "moment"
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {observer} from "mobx-react-lite";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import {DebounceSelect} from "../../../component/DebounceSelect";
import locale from "antd/es/date-picker/locale/ru_RU";
import DoubleRightOutlined from "@ant-design/icons/lib/icons/DoubleRightOutlined";


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


export const MonitorPage = observer(props => {

    const [form] = Form.useForm();
    const {servers, glossary} = useRootStore()


    const [date, setDate] = useState([moment(new Date(), "DD.MM.YYYY"), moment(new Date(), "DD.MM.YYYY")])

    useEffect(() => {
        servers.getAll()
        servers.getReport(date)
        glossary.getGlossary('', "email");

        const id = setInterval(() => servers.getAll(), 30000);
        return () => {
            clearInterval(id);
        };
    }, [])


    const [activeServerAddedModal, setActiveServerAddedModal] = useToggle(false)
    const [activeLogModal, setActiveLogModal] = useToggle(false)


    const onGetLog = async (id) => {
        await servers.getLog(id)
        setActiveLogModal(true)
    }

    const onListChange = async (pagination) => {
        await servers.getLog(servers.id, {pagination})
    };

    const onChange = async (id, form) => {
        await servers.change(id, form)
    };

    const onDelete = async (id) => {

        Modal.confirm({
            title: 'Вы действительно хотите удалить запись?',
            icon: <ExclamationCircleOutlined/>,
            // content: 'Some descriptions',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                servers.delete(id)
            },

        });


    };

    const onEdit = async (id) => {
        await servers.getServer(id)
        // console.log(servers.server.sendmail.split(',').map(item=>({value: item, label: item})))
        form.setFieldsValue({
            ...servers.server,
            sendmail: servers.server.sendmail.split(',').map(item => ({value: item, label: item}))
        })
        setActiveServerAddedModal()

    };
    const onCancel = () => {
        servers.cleanServer()
        form.resetFields();
        setActiveServerAddedModal()

    };
    const onModalAdd = async () => {
        setActiveServerAddedModal()
    };
    const onTableChange = async (pagination, filters,) => {

        await servers.getAll({
            pagination,
            filters
        })

    };


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
    const getColumnSearchProps = (dataIndex) => ({

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


    const onSaveForm = async () => {
        const value = await form.validateFields()
        if (_.isEmpty(servers.server)) {
            await servers.create(value)
        } else servers.change(servers.server.id, value)

    }
    const columns = [
        {
            title: "Действие",
            render: (record) => (
                <>
                    <Space size="middle">
                        <Tooltip title="Просмотр">
                            <Button shape="circle"
                                    icon={<EyeOutlined/>}
                                    onClick={() => onGetLog(record.id)}
                                    size="large"/>
                        </Tooltip>
                        {record.status === "play" ? <Tooltip title="Пауза">

                                <Button shape="circle"
                                        onClick={() => onChange(record.id, {status: 'pause'})}
                                        icon={<PauseOutlined/>}
                                        size="large"/>
                            </Tooltip> :
                            <Tooltip title="Старт">

                                <Button shape="circle"
                                        onClick={() => onChange(record.id, {status: 'play'})}
                                        icon={<CaretRightOutlined style={{color: '#f13607'}}/>}
                                        size="large"/>
                            </Tooltip>}


                        {record.notifi === "1" ? <Tooltip title="Оповещение Включено">

                                <Button shape="circle"
                                        onClick={() => onChange(record.id, {notifi: '0'})}
                                        icon={<CheckCircleOutlined/>}
                                        size="large"/>


                            </Tooltip> :
                            <Tooltip title="Оповещение Выключено">

                                <Button shape="circle"
                                        onClick={() => onChange(record.id, {notifi: '1'})}
                                        icon={<CloseCircleOutlined style={{color: '#f13607'}}/>}
                                        size="large"/>
                            </Tooltip>}
                        <Tooltip title="Редактировать">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                    icon={<EditOutlined/>}
                                    onClick={() => onEdit(record.id)}
                                    size="large"/>
                            {/*</NavLink>*/}

                        </Tooltip>
                        <Tooltip title="Удалить">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => onDelete(record.id)}
                                    size="large"/>
                            {/*</NavLink>*/}

                        </Tooltip>

                    </Space>
                </>)
        },

        {
            title: "IP",
            dataIndex: "ip",
            //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')
            ...getColumnSearchProps('ip'),

        },
        {
            title: "Адрес",
            dataIndex: "connect",
            //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')
            ...getColumnSearchProps('connect'),

        },
        {
            title: "Название",
            dataIndex: "name",
            ...getColumnSearchProps('name'),

        }, {
            title: "FecName",
            dataIndex: "fecname",
            ...getColumnSearchProps('name'),

        },
        {
            title: "Тип",
            dataIndex: 'type',
            // render: (record) => record.user.family,
            filters: [
                {text: 'WEB', value: 'WEB'},
                {text: 'БД', value: 'БД'},
            ],


        }, {
            title: "Время проверки",
            dataIndex: "time",
            render: (text) => text && moment(+text).format("HH:mm DD.MM.YYYY"),

        }, {
            title: "Состояние",
            dataIndex: "state",
            //  render: (record) => record.user.division,
            filters: [
                {text: 'Работает', value: 'Работает'},
                {text: 'Нет сигнала', value: 'Нет сигнала'},
            ],

            render: (text) =>
                <Space size="middle">
                    <Tag color={text === "Работает" ? "green" : text === "Ожидание" ? "blue" : "red"}>
                        {text}
                    </Tag>
                </Space>,
        },

    ]


    ////////////////////ОТЧЕТ////////////////
    async function onChangeDate(dates) {
        await servers.getReport(dates)
        setDate(dates)
    }

    const columnsReport = [

        {
            title: "Название",
            dataIndex: "name",
            //  render: (text) => moment(text).format('HH:mm DD:MM:YYYY')

        },
        {
            title: "Описание",
            dataIndex: "description",
            render: (text) => <div className="text_table">
                {text}
            </div>

        },
        {
            title: "Период сбоя(бездействие)",
            render: (record) =>
                record.time.map(item => <div><span>{moment(item.in).format('HH:mm DD:MM:YYYY')} - </span>
                    <span>
                    {item.to ? <> {moment(item.to).format('HH:mm DD:MM:YYYY')}
                        <span>({moment(Date.parse(item.to) - Date.parse(item.in) - 10800000).format('HH:mm')})</span> </> : <>
                        <DoubleRightOutlined/>
                        <span>({moment(Date.now() - Date.parse(item.in) - 10800000).format('HH:mm')})</span> </>}

                    </span>
                </div>)

        }, {
            title: "Кол-во сбоев",
            render: (record) => record.time.length


        }

    ]

    return (

        <>
            <div className="title">Мониторинг</div>
            <div className="contentOut">
                <Tabs type="card">
                    <Tabs.TabPane tab="Общая" key="1">
                        <div className="w100">
                            <Table scroll={{x: 900}}
                                   size="small"
                                   rowKey={record => record.id}
                                   loading={servers.loading}
                                   columns={columns}
                                   dataSource={servers.all}
                                   pagination={servers.paginationServer}
                                   onChange={onTableChange}
                                   title={() =>

                                       <div className="table_header">
                                           <span>Всего: {servers.paginationServer.total}</span>
                                           <div>
                                               <Button className="btn" onClick={() => servers.getAll()} type="primary">
                                                   <RedoOutlined/> Обновить
                                               </Button>
                                               <Button className="btn" onClick={() => onModalAdd()} type="primary">
                                                   <PlusOutlined/> Добавить
                                               </Button>
                                           </div>

                                       </div>

                                   }

                            />

                            <Modal
                                title="Добавить сервер"
                                visible={activeServerAddedModal}
                                //  footer={null}
                                okText="Create"
                                onCancel={onCancel}
                                // onOk={onSaveForm}

                                footer={[
                                    <Button key="submit" type="primary" onClick={onSaveForm}>
                                        {_.isEmpty(servers.server) ? "Добавить" : "Изменить"}
                                    </Button>,

                                ]}

                            >

                                <Form
                                    {...formItemLayout}
                                    form={form}
                                >
                                    <Form.Item
                                        label="IP"
                                        name="ip"
                                        rules={[{required: true, message: ''}]}
                                    >
                                        <Input placeholder="ip адрес"/>
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
                                        <DebounceSelect
                                            tags={true}
                                            glossary='email'
                                            showSearch
                                            loadingSelect={glossary.loadingSelect}
                                            getGlossary={(value, glossaryname) => glossary.getGlossary(value, glossaryname)}
                                            placeholder="test1@mail.ru"
                                            defaultOptions={glossary.glossary.email}
                                            onAddWord={(word, glossaryname) => glossary.addWord(word, glossaryname)}

                                        />

                                    </Form.Item>
                                    <Form.Item
                                        label="Тип"
                                        name="type"
                                        rules={[{required: true, message: ''}]}
                                    >
                                        <Select
                                            style={{width: 200}}
                                            placeholder="Выберите"
                                        >
                                            <Select.Option value="web">WEB</Select.Option>
                                            <Select.Option value="бд">БД</Select.Option>

                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                                    >
                                        {({getFieldValue}) =>
                                            getFieldValue('type') === 'web' ? (
                                                <Form.Item
                                                    label="Ключевое слово"
                                                    name="keyword"
                                                    rules={[{required: true, message: ''}]}
                                                >
                                                    <Input placeholder="Введите слово на сайте"/>
                                                </Form.Item>
                                            ) : getFieldValue('type') === 'бд' ?

                                                (
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
                                                ) : null
                                        }
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
                            <Modal
                                title="История"
                                visible={activeLogModal}
                                footer={null}
                                style={{top: 20}}
                                onCancel={setActiveLogModal}

                            >
                                <List
                                    size="small"
                                    bordered
                                    pagination={{
                                        onChange: async (page, pageSize) => {
                                            await onListChange({
                                                current: page,
                                                pageSize
                                            })

                                        },
                                        ...servers.pagination
                                    }}
                                    dataSource={servers.log}
                                    renderItem={item => <List.Item>
                                        <Tag color={item.status === "Работает" ? "green" : "red"}>
                                            {item.status}
                                        </Tag>
                                        {moment(item.createdAt).format("HH:mm DD.MM.YYYY")} {item.text}
                                    </List.Item>}
                                />


                            </Modal>

                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Отчет" key="2">
                        <div>
                            <div className='time_stat'>
                                <DatePicker.RangePicker
                                    locale={locale}
                                    ranges={{
                                        "Сегодня": [moment(), moment()],
                                        'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                        'Неделя': [moment().subtract(7, 'days'), moment()],
                                        'Месяц': [moment().subtract(30, 'days'), moment()],

                                    }}
                                    onChange={onChangeDate}
                                    defaultValue={[moment(new Date(), "DD.MM.YYYY"), moment(new Date(), "DD.MM.YYYY")]}
                                    format={"DD.MM.YYYY"}
                                />
                                <Button className="btn"
                                        onClick={() => servers.getReport(date)}
                                        type="primary">
                                    <RedoOutlined/> Обновить
                                </Button>
                            </div>

                            <Table scroll={{x: 900}}
                                   size="small"
                                   rowKey={record => record.id}
                                   loading={servers.loadingReport}
                                   columns={columnsReport}
                                   dataSource={servers.report}
                                   pagination={false}
                                   title={() =>
                                       <div className="table_header">
                                           <span>Всего: {servers.report.length}</span>
                                       </div>
                                   }
                            />
                        </div>
                    </Tabs.TabPane>
                </Tabs>


            </div>


        </>

    );
});
