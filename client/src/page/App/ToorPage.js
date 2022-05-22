import React, {useEffect, useState} from "react";
import {MaskedInput} from "antd-mask-input";

import "./docum.css"

import {observer} from "mobx-react-lite";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tabs, Tag,
    Tooltip,

} from "antd";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import {useRootStore} from "../../store";
import {Loader} from "../../component/Loader";
import {DebounceSelect} from "../../component/DebounceSelect";
import UserAddOutlined from "@ant-design/icons/lib/icons/UserAddOutlined";
import SwapOutlined from "@ant-design/icons/lib/icons/SwapOutlined";
import mans from "../../asset/img/mans.png";
import robots from "../../asset/img/robots.png";
import logo from "../../asset/img/toor.png";
import {useToggle} from "react-use";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import PauseOutlined from "@ant-design/icons/lib/icons/PauseOutlined";
import CaretRightOutlined from "@ant-design/icons/lib/icons/CaretRightOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {getColorNum} from "../../asset/utils/utils";
import moment from "moment";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import {current_user} from "../../store/currentUser";
import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined";
const {RangePicker} = DatePicker





export const ToorPage = observer(props => {


    const {accountStore, toorStore, current_user} = useRootStore()

    const{ toors, myToors, adminToors }=toorStore
    const {loadingDataUser}=accountStore





    useEffect( async () => {
        await toorStore.getAll()
        await toorStore.getMyAll()
        await toorStore.getAdminAll()
        await accountStore.getAll()


    }, [])


    const [form] = Form.useForm();

    const [activeAddToor, setActiveAddToor] = useToggle(false)
    const [activeAddUser, setActiveAddUser] = useToggle(false)
    const [pageSize, setPageSize] = useState(0)


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
    //////////////////////////////////ПОИСК///////







    const onEditToor = async (id) => {

        const toor= {...toors.filter(item=>item.id===id)[0]}
        form.setFieldsValue({...toor, date: [moment(Date.parse(toor.start)), moment(Date.parse(toor.end))]})
        setActiveAddToor()

    };
    const onCancelModalToor = () => {
        form.resetFields();
        setActiveAddToor()

    };
    const onChangeTable = (pagination) => {
        setPageSize((pagination.current-1)*pagination.pageSize)
    };


    const onCreateToor = async () => {
        const value = await form.validateFields()

        if (value.id) {
            await toorStore.change(value.id, value)
        } else{
            await toorStore.create(value)

        }
        setActiveAddToor()
    }


    const onExcludeAccount = async (id, value) => {
        let text = window.prompt('Комментарий?', "Нарушение правил")
        if(text){
            await accountStore.change(id, {...value, comment_monit: text })
            await toorStore.getAdminAll()

        }

    }

    const onChangeAccountAdmin = async (id, value) => {
            await accountStore.change(id, value)
            await toorStore.getAdminAll()

        }



    const onDeleteToor = async (id) => {
        if (window.confirm("Удалить турнир?")) {
            await toorStore.delete(id)

        }

    }
    const onChangeAccount = async (id, value) => {
        if (window.confirm("Выйти из турнира?")) {
            await accountStore.change(id, value)
            await toorStore.getMyAll()


        }

    }

    const onCreateAccount = async (values) => {
       await accountStore.change(values.accountId, values)
        await toorStore.getMyAll()
        setActiveAddUser()
    }


    const onUpdateToor = async () => {
       // await accountStore.getDataAll()
        await toorStore.getAll()

    }
    const onUpdateToorAdmin = async () => {
       // await accountStore.getDataAll()
        await toorStore.getAdminAll()

    }
    const onUpdateMyToor = async () => {
       // await accountStore.getDataAll()
        await toorStore.getMyAll()

    }

    const onUpdateAccount = (toorId) => {
        accountStore.getDataAll(toorId)
    }







    const columns = [

        {
            title: "",
            dataIndex: "name",
            render: (text) => <b>{text}</b>


        },
        {
            title: "Начало",
            dataIndex: "start",

            render: (start) => {
                return (
                    <span>
         {moment(start).format("HH:mm DD.MM.YYYY")}
          </span>
                )

            }


        }, {
            title: "Конец",
            dataIndex: "end",
            render: (end) => {
                return (
                    <span>
                {moment(end).format("HH:mm DD.MM.YYYY")}
              </span>
                )
            }

        },
        {
            title: "Стартовый депозит",
            dataIndex: 'balance',


        },
        {
            title: "Оборот",
            dataIndex: "turn",


        },

        {
            title: "Состояние",
            dataIndex: "status",
            render: (status) => {

                return (
                    <Tag color={status === "Активный" ? "green" : status === "Завершен" ? "magenta" : "orange"}>
                        {status}
                    </Tag>

                )

            }
        },



    ]


    if(current_user.user.role==="Администратор"){
        columns.push(  {
            title: "Действие",
            render: (record) => (
                <>
                    <Space size="middle">

                        {record.status === "Активный" ? <Tooltip title="Пауза">

                                <Button shape="circle"
                                        onClick={() => toorStore.change(record.id, {status: "Пауза"})}
                                        icon={<PauseOutlined/>}
                                        size="small"/>
                            </Tooltip> :
                            <Tooltip title="Старт">

                                <Button shape="circle"
                                        onClick={() => toorStore.change(record.id, {status: "Активный"})}

                                        icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
                                        size="small"/>
                            </Tooltip>}


                        <Tooltip title="Редактировать">
                            <Button shape="circle"
                                    icon={<EditOutlined/>}
                                    onClick={() => onEditToor(record.id)}
                                    size="small"/>


                        </Tooltip>
                        <Tooltip title="Удалить">
                            <Button shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => onDeleteToor(record.id)}
                                    size="small"/>


                        </Tooltip>

                    </Space>
                </>)
        },)
    }
    const subcolumns = [

        {
            title: "Позиция",
            render: (text, row, index) => (
                <>
                    {pageSize+index + 1}

                </>
            )
        },
        {
            title: "Никнейм",
            dataIndex: "username",
            // ...getColumnSearchProps('name'),
            ...getColumnSearchProps('username'),


        }, {
            title: "Депозит",
            dataIndex: "deposit",
        },
        {
            title: "Текущий депозит",
            dataIndex: "balance",
            defaultSortOrder: 'descend',
            sorter: (a, b) => +a.balance - +b.balance,
        },
        {
            title: "Тикет/позиции/откр./ликвид./PNL",
            dataIndex: 'transaction',
            align: 'left',
            render: (text) =>
                text &&
                <table className="minitable">

                    {text.split(',').map(item=> (
                        <tr>

                            <td>{item.split(':')[0]}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[0])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[1])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[2])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[3])}</td>
                        </tr>

                    ))}
                </table>

        },
        {
            title: "Ордеры",
            dataIndex: "trade",
            // render: (text) => text && moment(+text).format("HH:mm DD.MM.YYYY"),

        },

        {
            title: "API",
            dataIndex: "api",


        },
        {
            title: "@Telegram",
            dataIndex: "connection",

        },
        {
            title: "Статус",
            dataIndex: "status_monit",
            render: (status) => {

                return (
                    <Tag
                        color={status === "Активный" ? "green" : status === "Завершен" ? "orange" : "magenta"}>
                        {status}
                    </Tag>

                )

            }


        },
        {
            title: "События",
            dataIndex: "comment_monit",
            render: (text, record) => {



                let textData= text?.split('#') || ""

                if (text === "Обновлен:") {
                    return (
                        <>
                            <span> Обновлен: {moment(record.updatedAt).format("HH:mm DD.MM.YYYY")} </span>
                        </>

                    )

                } else if(textData[1]){
                    return (
                        <>
                            <span> Обновлен: {moment(textData[1]).format("HH:mm DD.MM.YYYY")} </span>
                        </>

                    )
                }

                else  return (
                        <span> {text}</span>

                    )


            }


        },

        {
            title: "Действие",
            render: (record) =>
                {
                    if(record.userId===current_user.user.id){
                        return  <>
                            <Space size="middle">
                                <Tooltip title="Выход">
                                    <Button shape="circle"
                                            icon={<LogoutOutlined />}
                                            onClick={event => onChangeAccount(record.id, {toorId: null})}
                                            size="small"/>

                                </Tooltip>

                            </Space>
                        </>
                    }
                }

        },

    ]
    const subcolumnsAdmin = [

        {
            title: "Позиция",
            render: (text, row, index) => (
                <>
                    {pageSize+index + 1}

                </>
            )
        },
        {
            title: "Никнейм",
            dataIndex: "username",
            // ...getColumnSearchProps('name'),
            ...getColumnSearchProps('username'),


        }, {
            title: "Депозит",
            dataIndex: "deposit",
        },
        {
            title: "Текущий депозит",
            dataIndex: "balance",
            defaultSortOrder: 'descend',
            sorter: (a, b) => +a.balance - +b.balance,
        },
        {
            title: "Тикет/позиции/откр./ликвид./PNL",
            dataIndex: 'transaction',
            align: 'left',
            render: (text) =>
                text &&
                <table className="minitable">

                    {text.split(',').map(item=> (
                        <tr>

                            <td>{item.split(':')[0]}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[0])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[1])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[2])}</td>
                            <td>{getColorNum(item.split(':')[1].split('/')[3])}</td>
                        </tr>

                    ))}
                </table>

        },
        {
            title: "Ордеры",
            dataIndex: "trade",
            // render: (text) => text && moment(+text).format("HH:mm DD.MM.YYYY"),

        },

        {
            title: "API",
            dataIndex: "api",


        },
        {
            title: "@Telegram",
            dataIndex: "connection",

        },
        {
            title: "Статус",
            dataIndex: "status_monit",
            render: (status) => {

                return (
                    <Tag
                        color={status === "Активный" ? "green" : status === "Завершен" ? "orange" : "magenta"}>
                        {status}
                    </Tag>

                )

            }


        },
        {
            title: "События",
            dataIndex: "comment_monit",
            render: (text, record) => {



                let textData= text?.split('#') || ""

                if (text === "Обновлен:") {
                    return (
                        <>
                            <span> Обновлен: {moment(record.updatedAt).format("HH:mm DD.MM.YYYY")} </span>
                        </>

                    )

                } else if(textData[1]){
                    return (
                        <>
                            <span> Обновлен: {moment(textData[1]).format("HH:mm DD.MM.YYYY")} </span>
                        </>

                    )
                }

                else  return (
                        <span> {text}</span>

                    )


            }


        },

        {
            title: "Действие",
            render: (record) => (
                <>
                    <Space size="middle">
                        <Tooltip title="Обновить">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                // icon={<ReloadOutlined />}
                                    icon={(loadingDataUser.loading && loadingDataUser.userId===record.id)? <LoadingOutlined /> : <ReloadOutlined /> }
                                    onClick={event => accountStore.getData(record.id)}
                                    size="small"/>
                            {/*</NavLink>*/}

                        </Tooltip>


                        {record.status_monit === "Активный" ? <Tooltip title="Исключить из мониторинга">

                                <Button shape="circle"
                                    //  onClick={() => onChange(record.id, {status: 'pause'})}
                                        onClick={event => onExcludeAccount(record.id, {status_monit: "Исключен"})}
                                        icon={<PauseOutlined/>}
                                        size="small"/>
                            </Tooltip> :
                            <Tooltip title="Активировать">
                                <Button shape="circle"

                                    // onClick={() => onChange(record.id, {status: 'play'})}
                                        onClick={event => onChangeAccountAdmin(record.id, {status_monit: "Активный"})}
                                        icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
                                        size="small"/>
                            </Tooltip>}

                        <Tooltip title="Выход">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                    icon={<LogoutOutlined />}
                                    onClick={event => onChangeAccount(record.id, {toorId: null})}
                                    size="small"/>
                            {/*</NavLink>*/}

                        </Tooltip>

                    </Space>
                </>)
        },

    ]
    // const subcolumnsRevers = [
    //
    //     {
    //         title: "Позиция",
    //         render: (text, row, index) => (
    //             <>
    //                 {pageSize+index + 1}
    //
    //             </>
    //         )
    //
    //     },
    //     {
    //         title: "Никнейм",
    //         dataIndex: "username",
    //         // ...getColumnSearchProps('name'),
    //         ...getColumnSearchProps('username'),
    //
    //
    //     },
    //
    //     {
    //         title: "Текущий депозит",
    //         dataIndex: "balance",
    //         defaultSortOrder: 'descend',
    //         sorter: (a, b) => +a.balance - +b.balance,
    //     }, {
    //         title: "Тикет",
    //         dataIndex: "tiket",
    //         sorter: (a, b) =>{
    //             if(a.tiket && b.tiket ){
    //                 let nameA=a.tiket.toLowerCase(), nameB=b.tiket.toLowerCase()
    //                 if (nameA < nameB)
    //                     return -1
    //                 if (nameA > nameB)
    //                     return 1
    //                 return 0
    //             }
    //
    //         },
    //     }, {
    //         title: "Позиции",
    //         dataIndex: "poz",
    //         render: text => getColorNum(text),
    //         sorter: (a, b) => +a.poz - +b.poz,
    //     }, {
    //         title: "Откр",
    //         dataIndex: "open",
    //         render: text => getColorNum(text),
    //         sorter: (a, b) => +a.open - +b.open,
    //     }, {
    //         title: "Ликвид",
    //         dataIndex: "lic",
    //         render: text => getColorNum(text),
    //         sorter: (a, b) => +a.lic - +b.lic,
    //     },
    //     {
    //         title: "PNL",
    //         dataIndex: "pnl",
    //         render: text => getColorNum(text),
    //         sorter: (a, b) => +a.pnl - +b.pnl,
    //     },
    //     {
    //         title: "Рынок",
    //         dataIndex: "mark",
    //         render: text => getColorNum(text),
    //         sorter: (a, b) => +a.mark - +b.mark,
    //     },
    //     {
    //         title: "Рынок-Ликвид",
    //         render: (record) => getColorNum(Math.floor(Number(record.mark)-Number(record.lic))),
    //         sorter: (a, b) => Math.floor(Number(a.mark)-Number(a.lic)) - Math.floor(Number(b.mark)-Number(b.lic))
    //
    //     },
    //
    //     {
    //         title: "Ордеры",
    //         dataIndex: "trade",
    //
    //     },
    //
    //     {
    //         title: "API",
    //         dataIndex: "api",
    //
    //
    //     },
    //     {
    //         title: "@Telegram",
    //         dataIndex: "connection",
    //
    //     },
    //     {
    //         title: "Статус",
    //         dataIndex: "status",
    //         render: (status) => {
    //
    //             return (
    //                 <Tag
    //                     color={status === "Активный" ? "green" : status === "Завершен" ? "orange" : "magenta"}>
    //                     {status}
    //                 </Tag>
    //
    //             )
    //
    //         }
    //
    //
    //     },
    //     {
    //         title: "События",
    //         dataIndex: "comment_monit",
    //         render: (text, record) => {
    //
    //             let textData= text.split('#')
    //
    //             if (text === "Обновлен:") {
    //                 return (
    //                     <>
    //                         <span> Обновлен: {moment(record.updatedAt).format("HH:mm DD.MM.YYYY")} </span>
    //                     </>
    //
    //                 )
    //
    //             } else if(textData[1]){
    //                 return (
    //                     <>
    //                         <span> Обновлен: {moment(textData[1]).format("HH:mm DD.MM.YYYY")} </span>
    //                     </>
    //
    //                 )
    //             }
    //
    //             else  return (
    //                     <span> {text}</span>
    //
    //                 )
    //
    //
    //         }
    //
    //
    //     },
    //
    //     {
    //         title: "Действие",
    //         render: (record) => (
    //             <>
    //                 <Space size="middle">
    //                     <Tooltip title="Обновить">
    //
    //                         <Button shape="circle"
    //
    //                                 icon={(accountStore.loadingDataUser.loading && accountStore.loadingDataUser.userId===record.id)? <LoadingOutlined /> : <ReloadOutlined /> }
    //                                 onClick={event => accountStore.loadingGetData(record.id)}
    //                                 size="small"/>
    //
    //
    //                     </Tooltip>
    //
    //
    //                     {record.status === "Активный" ? <Tooltip title="Исключить из мониторинга">
    //
    //                             <Button shape="circle"
    //
    //                                     onClick={event => accountStore.change(record.id, {status_monit: "Активный"})}
    //                                     icon={<PauseOutlined/>}
    //                                     size="small"/>
    //                         </Tooltip> :
    //                         <Tooltip title="Активировать">
    //                             <Button shape="circle"
    //
    //                                     onClick={event => accountStore.change(record.id, {status_monit: "Исключен"})}
    //                                     icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
    //                                     size="small"/>
    //                         </Tooltip>}
    //
    //                     <Tooltip title="Удалить">
    //
    //                         <Button shape="circle"
    //                                 icon={<DeleteOutlined/>}
    //                                 onClick={event => accountStore.delete(record.id)}
    //                                 size="small"/>
    //
    //
    //                     </Tooltip>
    //
    //                 </Space>
    //             </>)
    //     },
    //
    // ]









    return (
        <>
            <div className="title">Турниры</div>
            <div className="contentOut">
                <Tabs type="card">
                    <Tabs.TabPane tab="Мои" key="1">




                        <Modal
                            title="Добавить аккаунт"
                            visible={activeAddUser}
                            footer={null}
                            onCancel={()=>setActiveAddUser()}

                        >
                            <Form
                                labelCol={{ span: 13 }}
                                wrapperCol={{ span: 10}}
                                onFinish={onCreateAccount}


                            >
                                <Form.Item
                                    label="Никнейм(Имя)"
                                    name="accountId"
                                    rules={[{ required: true, message: 'Введите никнейм' }]}
                                >
                                    <Select placeholder="Выбрать аккаунт">
                                        {accountStore.accounts.map(account=> <Select.Option value={account.id}>{account.username} {account.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    label="Выбор турнира"
                                    name="toorId"
                                    rules={[{ required: true, message: 'Выберите турнир!' }]}
                                >
                                    <Select placeholder="Выбрать">
                                        {toorStore.toors.map(toor=> <Select.Option value={toor.id}>{toor.name} {toor.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 11, span: 5 }}>
                                    <Button disabled={accountStore.loading} type="primary" htmlType="submit">
                                        Регистрация
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                         {toors.length > 0 &&
                    <Button onClick={onUpdateMyToor} type="primary">Обновить</Button>}

                        {toors.length > 0 ?
                            <div className="table-box">
                                <Table
                                    scroll={{x: 700}}
                                    loading={toorStore.loading}
                                    expandable={{
                                        expandedRowRender: toor => {
                                            const humans = toor.accounts.length > 0 ? toor.accounts.filter(account => account.category === "humans" ) : []
                                            const bot = toor.accounts.length > 0 ? toor.accounts.filter(account => account.category === "bot" ): []

                                            const humansRevers = []
                                            const botRevers = [];

                                            humans && toor.isRevers &&  humans.map(item=>{


                                                item.transaction &&  item.transaction.split(',').map(tranz=>{
                                                    humansRevers.push({
                                                        tiket: tranz.split(':')[0],
                                                        poz: tranz.split(':')[1].split('/')[0],
                                                        open: tranz.split(':')[1].split('/')[1],
                                                        lic: tranz.split(':')[1].split('/')[2],
                                                        pnl: tranz.split(':')[1].split('/')[3],
                                                        mark: tranz.split(':')[1].split('/')[4],
                                                        username: item.username,
                                                        comment: item.comment,
                                                        status: item.status,
                                                        api: item.api,
                                                        trade: item.trade,
                                                        connection: item.connection,
                                                        balance: item.balance,
                                                        id: item.id,
                                                        updatedAt: item.updatedAt,


                                                    })

                                                })
                                            })

                                            bot && toor.isRevers && bot.map(item=>{

                                                item.transaction &&   item.transaction.split(',').map(tranz=>{

                                                    botRevers.push({
                                                        tiket: tranz.split(':')[0],
                                                        poz: tranz.split(':')[1].split('/')[0],
                                                        open: tranz.split(':')[1].split('/')[1],
                                                        lic: tranz.split(':')[1].split('/')[2],
                                                        pnl: tranz.split(':')[1].split('/')[3],
                                                        mark: tranz.split(':')[1].split('/')[4],
                                                        username: item.username,
                                                        comment: item.comment,
                                                        status: item.status,
                                                        api: item.api,
                                                        trade: item.trade,
                                                        connection: item.connection,
                                                        balance: item.balance,
                                                        id: item.id,
                                                        updatedAt: item.updatedAt,


                                                    })

                                                })
                                            })



                                            return (
                                                <React.Fragment key={toor.id}>

                                                    <div>
                                                        <img className="icons" src={mans} alt="man"/>
                                                    </div>

                                                    <Table
                                                        size="small"
                                                        dataSource={humans}
                                                        loading={accountStore.loading}
                                                        columns={subcolumns}
                                                        onChange={onChangeTable}
                                                    >

                                                    </Table>

                                                    <img className="icons" src={robots} alt="man"/>
                                                    <Table
                                                        size="small"
                                                        dataSource={bot}
                                                        loading={accountStore.loading}
                                                        columns={subcolumns}
                                                        onChange={onChangeTable}
                                                    >
                                                    </Table>

                                                </React.Fragment>
                                            )
                                        },
                                        defaultExpandedRowKeys: toors.filter(item=> item.status==="Активный").map(item=>item.id)

                                    }}
                                    dataSource={myToors}
                                    columns={columns}
                                >


                                </Table>

                            </div>

                            :  toorStore.loading ? <Loader/> :  <div className="imgBox">
                                <img className="img" src={logo} alt="Картинка"/>
                                <h1>Добавьте аккаунт в один из турниров</h1>
                            </div>
                        }



                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Все" key="2">
                        <Modal
                            title="Создать турнир"
                            visible={activeAddToor}
                            okText="Create"
                            onCancel={onCancelModalToor}
                            footer={[
                                <Button key="submit" type="primary" onClick={onCreateToor}>
                                    Сохранить
                                </Button>,
                            ]}
                        >
                            <Form
                                labelCol={{span: 6}}
                                wrapperCol={{span: 15}}
                                form={form}
                            >

                                <Form.Item
                                    name="id"
                                    noStyle

                                >

                                </Form.Item>
                                <Form.Item
                                    label="Название"
                                    name="name"
                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <Input placeholder='Название'/>
                                </Form.Item>
                                <Form.Item
                                    label="Депозит"
                                    name="balance"

                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <InputNumber placeholder='10000' style={{width: "100%"}}/>
                                </Form.Item>

                                <Form.Item
                                    label="Дата"
                                    name="date"
                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <RangePicker
                                        showTime={{format: "HH:mm"}}
                                        format="YYYY-MM-DD HH:mm"
                                    />
                                </Form.Item>



                            </Form>
                        </Modal>


                        <Modal
                            title="Добавить аккаунт"
                            visible={activeAddUser}
                            footer={null}
                            onCancel={()=>setActiveAddUser()}

                        >
                            <Form
                                labelCol={{ span: 13 }}
                                wrapperCol={{ span: 10}}
                                onFinish={onCreateAccount}


                            >
                                <Form.Item
                                    label="Никнейм(Имя)"
                                    name="accountId"
                                    rules={[{ required: true, message: 'Введите никнейм' }]}
                                >
                                    <Select placeholder="Выбрать аккаунт">
                                        {accountStore.accounts.map(account=> <Select.Option value={account.id}>{account.username} {account.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    label="Выбор турнира"
                                    name="toorId"
                                    rules={[{ required: true, message: 'Выберите турнир!' }]}
                                >
                                    <Select placeholder="Выбрать">
                                        {toorStore.toors.map(toor=> <Select.Option value={toor.id}>{toor.name} {toor.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 11, span: 5 }}>
                                    <Button disabled={accountStore.loading} type="primary" htmlType="submit">
                                        Регистрация
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Button type="primary" onClick={() => setActiveAddToor()}>Создать турнир</Button >  <Tooltip title="Добавить">
                        <Button  onClick={()=>setActiveAddUser()} type="primary">
                            <UserAddOutlined />
                        </Button>

                    </Tooltip> {toors.length > 0 &&
                    <Button onClick={onUpdateToor} type="primary">Обновить</Button>}

                        {toors.length > 0 ?
                            <div className="table-box">
                                <Table
                                    scroll={{x: 700}}
                                    loading={toorStore.loading}

                                    dataSource={toors}
                                    columns={columns}
                                >


                                </Table>

                            </div>

                            :  toorStore.loading ? <Loader/> :  <div className="imgBox">
                                <img className="img" src={logo} alt="Картинка"/>
                                <h1>Создайте турнир для добавления аккаунтов</h1>
                            </div>
                        }





                    </Tabs.TabPane>
                    {current_user.user.role==='Администратор' &&  <Tabs.TabPane tab="Все Админ" key="3">
                        <Modal
                            title="Создать турнир"
                            visible={activeAddToor}
                            okText="Create"
                            onCancel={onCancelModalToor}
                            footer={[
                                <Button key="submit" type="primary" onClick={onCreateToor}>
                                    Сохранить
                                </Button>,
                            ]}
                        >
                            <Form
                                labelCol={{span: 6}}
                                wrapperCol={{span: 15}}
                                form={form}
                            >

                                <Form.Item
                                    name="id"
                                    noStyle

                                >

                                </Form.Item>
                                <Form.Item
                                    label="Название"
                                    name="name"
                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <Input placeholder='Название'/>
                                </Form.Item>
                                <Form.Item
                                    label="Депозит"
                                    name="balance"

                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <InputNumber placeholder='10000' style={{width: "100%"}}/>
                                </Form.Item>

                                <Form.Item
                                    label="Дата"
                                    name="date"
                                    rules={[{required: true, message: 'Введите значение'}]}
                                >
                                    <RangePicker
                                        showTime={{format: "HH:mm"}}
                                        format="YYYY-MM-DD HH:mm"
                                    />
                                </Form.Item>



                            </Form>
                        </Modal>


                        <Modal
                            title="Добавить аккаунт"
                            visible={activeAddUser}
                            footer={null}
                            onCancel={()=>setActiveAddUser()}

                        >
                            <Form
                                labelCol={{ span: 13 }}
                                wrapperCol={{ span: 10}}
                                onFinish={onCreateAccount}


                            >
                                <Form.Item
                                    label="Никнейм(Имя)"
                                    name="accountId"
                                    rules={[{ required: true, message: 'Введите никнейм' }]}
                                >
                                    <Select placeholder="Выбрать аккаунт">
                                        {accountStore.accounts.map(account=> <Select.Option value={account.id}>{account.username} {account.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    label="Выбор турнира"
                                    name="toorId"
                                    rules={[{ required: true, message: 'Выберите турнир!' }]}
                                >
                                    <Select placeholder="Выбрать">
                                        {toorStore.toors.map(toor=> <Select.Option value={toor.id}>{toor.name} {toor.balance}</Select.Option>)}


                                    </Select>
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 11, span: 5 }}>
                                    <Button disabled={accountStore.loading} type="primary" htmlType="submit">
                                        Регистрация
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Button type="primary" onClick={() => setActiveAddToor()}>Создать турнир</Button >  <Tooltip title="Добавить">
                        <Button  onClick={()=>setActiveAddUser()} type="primary">
                            <UserAddOutlined />
                        </Button>

                    </Tooltip> {toors.length > 0 &&
                    <Button onClick={onUpdateToorAdmin} type="primary">Обновить</Button>}

                        {toors.length > 0 ?
                            <div className="table-box">
                                <Table
                                    scroll={{x: 700}}
                                    loading={toorStore.loading}
                                    expandable={{
                                        expandedRowRender: toor => {
                                            const humans = toor.accounts.length > 0 ? toor.accounts.filter(account => account.category === "humans" ) : []
                                            const bot = toor.accounts.length > 0 ? toor.accounts.filter(account => account.category === "bot" ): []

                                            const humansRevers = []
                                            const botRevers = [];

                                            humans && toor.isRevers &&  humans.map(item=>{


                                                item.transaction &&  item.transaction.split(',').map(tranz=>{
                                                    humansRevers.push({
                                                        tiket: tranz.split(':')[0],
                                                        poz: tranz.split(':')[1].split('/')[0],
                                                        open: tranz.split(':')[1].split('/')[1],
                                                        lic: tranz.split(':')[1].split('/')[2],
                                                        pnl: tranz.split(':')[1].split('/')[3],
                                                        mark: tranz.split(':')[1].split('/')[4],
                                                        username: item.username,
                                                        comment: item.comment,
                                                        status: item.status,
                                                        api: item.api,
                                                        trade: item.trade,
                                                        connection: item.connection,
                                                        balance: item.balance,
                                                        id: item.id,
                                                        updatedAt: item.updatedAt,


                                                    })

                                                })
                                            })

                                            bot && toor.isRevers && bot.map(item=>{

                                                item.transaction &&   item.transaction.split(',').map(tranz=>{

                                                    botRevers.push({
                                                        tiket: tranz.split(':')[0],
                                                        poz: tranz.split(':')[1].split('/')[0],
                                                        open: tranz.split(':')[1].split('/')[1],
                                                        lic: tranz.split(':')[1].split('/')[2],
                                                        pnl: tranz.split(':')[1].split('/')[3],
                                                        mark: tranz.split(':')[1].split('/')[4],
                                                        username: item.username,
                                                        comment: item.comment,
                                                        status: item.status,
                                                        api: item.api,
                                                        trade: item.trade,
                                                        connection: item.connection,
                                                        balance: item.balance,
                                                        id: item.id,
                                                        updatedAt: item.updatedAt,


                                                    })

                                                })
                                            })



                                            return (
                                                <React.Fragment key={toor.id}>

                                                    <div>
                                                        <img className="icons" src={mans} alt="man"/>
                                                    </div>

                                                    <Table
                                                        size="small"
                                                        dataSource={humans}
                                                        loading={accountStore.loading}
                                                        columns={subcolumnsAdmin}
                                                        onChange={onChangeTable}
                                                    >

                                                    </Table>

                                                    <img className="icons" src={robots} alt="man"/>
                                                    <Table
                                                        size="small"
                                                        dataSource={bot}
                                                        loading={accountStore.loading}
                                                        columns={subcolumnsAdmin}
                                                        onChange={onChangeTable}
                                                    >
                                                    </Table>

                                                </React.Fragment>
                                            )
                                        },
                                        defaultExpandedRowKeys: toors.filter(item=> item.status==="Активный").map(item=>item.id)

                                    }}
                                    dataSource={adminToors}
                                    columns={columns}
                                >


                                </Table>

                            </div>

                            :  toorStore.loading ? <Loader/> :  <div className="imgBox">
                                <img className="img" src={logo} alt="Картинка"/>
                                <h1>Создайте турнир для добавления аккаунтов</h1>
                            </div>
                        }





                    </Tabs.TabPane> }

                </Tabs>

            </div>
        </>

    );

});
