import React, {useEffect, useState} from "react";

import {Button, DatePicker, Input, List, Modal, Space, Table, Tabs, Tag, Tooltip} from "antd";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import {observer} from "mobx-react-lite";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import {useToggle} from "react-use";
import {useRootStore} from "../../../store";
import moment from "moment"
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";
import locale from "antd/es/date-picker/locale/ru_RU";
import DoubleRightOutlined from "@ant-design/icons/lib/icons/DoubleRightOutlined";


export const StatusPage = observer(() => {

    const {servers} = useRootStore()


    const [date, setDate] = useState([moment(new Date(), "DD.MM.YYYY"), moment(new Date(), "DD.MM.YYYY")])
    useEffect(() => {
        servers.getAll()
        servers.getReport(date)
        const id = setInterval(() => servers.getAll(), 30000);
        return () => {

            clearInterval(id);
        };
    }, [])

    const [activeLogModal, setActiveLogModal] = useToggle(false)


    const onGetLog = async (id) => {
        await servers.getLog(id)
        setActiveLogModal(true)

    }

    const onListChange = async (pagination) => {
        await servers.getLog(servers.id, {pagination})
    };

    const onTableChange = async (pagination, filters,) => {

        await servers.getAll({
            pagination,
            filters
        })

    };


//////////////////////////////////ПОИСК///////

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
                    </Space>
                </>)
        },

        {
            title: "IP",
            dataIndex: "ip",
            ...getColumnSearchProps('ip'),

        },
        {
            title: "Адрес",
            dataIndex: "connect",
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


    //////////Отчет//////////////
    async function onChangeDate(dates) {
        await servers.getReport(dates)
        setDate(dates)
    }

    const columnsReport = [

        {
            title: "Название",
            dataIndex: "name",
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
            <div className="titleOut">Мониторинг</div>
            <div className="contentOut">
                <Tabs type="card">
                    <Tabs.TabPane tab="Общая" key="1">
                        <div className="w100">
                            <Table
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
                                        </div>

                                    </div>

                                }

                            />

                            <Modal
                                title="История"
                                visible={activeLogModal}
                                footer={null}
                                style={{top: 20}}
                                onCancel={setActiveLogModal}
                                width={700}

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
                                        <Tag color={item.status === "Активный" ? "green" : "red"}>
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
