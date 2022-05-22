import React, {useEffect, useState} from "react";
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
    Tag,
    Tooltip,
    Typography
} from 'antd';
import moment from 'moment';
import {useRootStore} from "../../store";
import { observer} from "mobx-react-lite";
import CaretRightOutlined from "@ant-design/icons/lib/icons/CaretRightOutlined";
import PauseOutlined from "@ant-design/icons/lib/icons/PauseOutlined";
import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {useToggle} from "react-use";
import SwapOutlined from "@ant-design/icons/lib/icons/SwapOutlined";
import {Loader} from "../../component/Loader";
import logo from "../../asset/img/group.png";
import mans from "../../asset/img/mans.png";
import robots from "../../asset/img/robots.png";
import Highlighter from 'react-highlight-words';
import UserAddOutlined from "@ant-design/icons/lib/icons/UserAddOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import ac from "prettier/esm/parser-yaml";
import {getColorNum} from "../../asset/utils/utils";



export const AccountPage = observer(props => {


    const {groupStore, accountStore} = useRootStore()

    const{ groups }=groupStore
    const {loadingDataUser}=accountStore



    useEffect( async () => {
       await groupStore.getGroups()
       await accountStore.getAll()


    }, [])


    const [form] = Form.useForm();

    const [activeAddGroup, setActiveAddGroup] = useToggle(false)
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







    const onEditGroup = async (id) => {

        const group= {...groups.filter(item=>item.id===id)[0]}
        form.setFieldsValue({...group})
        setActiveAddGroup()

    };
    const onCancelModalGroup = () => {
        form.resetFields();
        setActiveAddGroup()

    };
    const onChangeTable = (pagination) => {
        console.log(pagination)

        setPageSize((pagination.current-1)*pagination.pageSize)
    };


    const onCreateGroup = async () => {
        const value = await form.validateFields()

        if (value.id) {
            await groupStore.changeGroup(value.id, value)
        } else{
            await groupStore.createGroup(value)

        }

        setActiveAddGroup()
    }


    const onExcludeAccount = async (id, value) => {
        let text = window.prompt('Комментарий?', "Нарушение правил")
        if(text){
            await accountStore.change(id, {...value, comment: text })

        }

    }

    const onDeleteGroup = async (id) => {
        if (window.confirm("Удалить группу?")) {
            await groupStore.deleteGroup(id)

        }

    }
    const onDeleteAccount = async (id) => {
        if (window.confirm("Удалить аккаунт?")) {
            await accountStore.delete(id)

        }

    }

    const onCreateAccount =  (values) => {
        accountStore.create(values)
        setActiveAddUser()
    }


    const onUpdateGroup = async () => {
        await accountStore.getDataAll()
        await groupStore.getGroups()

    }

    const onUpdateAccount = (groupId) => {
        accountStore.getDataAll(groupId)
    }







    const columns = [

        {
            title: "",
            dataIndex: "name",
              render: (text) => <b>{text}</b>
            // ...getColumnSearchProps('connect'),

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

        {
            title: "Действие",
            render: (record) => (
                <>
                    <Space size="middle">

                        {record.status === "Активный" ? <Tooltip title="Пауза">

                                <Button shape="circle"
                                        onClick={() => groupStore.changeGroup(record.id, {status: "Пауза"})}
                                        icon={<PauseOutlined/>}
                                        size="small"/>
                            </Tooltip> :
                            <Tooltip title="Старт">

                                <Button shape="circle"
                                        onClick={() => groupStore.changeGroup(record.id, {status: "Активный"})}

                                        icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
                                        size="small"/>
                            </Tooltip>}


                        <Tooltip title="Редактировать">
                            <Button shape="circle"
                                    icon={<EditOutlined/>}
                                    onClick={() => onEditGroup(record.id)}
                                    size="small"/>


                        </Tooltip>
                        <Tooltip title="Удалить">
                            <Button shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => onDeleteGroup(record.id)}
                                    size="small"/>


                        </Tooltip>

                    </Space>
                </>)
        },

    ]
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
            dataIndex: "status",
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
            dataIndex: "comment",
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


                        {record.status === "Активный" ? <Tooltip title="Исключить из мониторинга">

                                <Button shape="circle"
                                    //  onClick={() => onChange(record.id, {status: 'pause'})}
                                        onClick={event => onExcludeAccount(record.id, {status: "Исключен"})}
                                        icon={<PauseOutlined/>}
                                        size="small"/>
                            </Tooltip> :
                            <Tooltip title="Активировать">
                                <Button shape="circle"

                                    // onClick={() => onChange(record.id, {status: 'play'})}
                                        onClick={event => accountStore.change(record.id, {status: "Активный"})}
                                        icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
                                        size="small"/>
                            </Tooltip>}

                        <Tooltip title="Удалить">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={event => onDeleteAccount(record.id)}
                                    size="small"/>
                            {/*</NavLink>*/}

                        </Tooltip>

                    </Space>
                </>)
        },

    ]
    const subcolumnsRevers = [

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


        },

        {
            title: "Текущий депозит",
            dataIndex: "balance",
            defaultSortOrder: 'descend',
            sorter: (a, b) => +a.balance - +b.balance,
        }, {
            title: "Тикет",
            dataIndex: "tiket",
            sorter: (a, b) =>{
                if(a.tiket && b.tiket ){
                    let nameA=a.tiket.toLowerCase(), nameB=b.tiket.toLowerCase()
                    if (nameA < nameB)
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0
                }

            },
        }, {
            title: "Позиции",
            dataIndex: "poz",
            render: text => getColorNum(text),
            sorter: (a, b) => +a.poz - +b.poz,
        }, {
            title: "Откр",
            dataIndex: "open",
            render: text => getColorNum(text),
            sorter: (a, b) => +a.open - +b.open,
        }, {
            title: "Ликвид",
            dataIndex: "lic",
            render: text => getColorNum(text),
            sorter: (a, b) => +a.lic - +b.lic,
        },
        {
            title: "PNL",
            dataIndex: "pnl",
            render: text => getColorNum(text),
            sorter: (a, b) => +a.pnl - +b.pnl,
        },
        {
            title: "Рынок",
            dataIndex: "mark",
            render: text => getColorNum(text),
            sorter: (a, b) => +a.mark - +b.mark,
        },
        {
            title: "Рынок-Ликвид",
            // dataIndex: "mark",
            render: (record) => getColorNum(Math.floor(Number(record.mark)-Number(record.lic))),
            sorter: (a, b) => Math.floor(Number(a.mark)-Number(a.lic)) - Math.floor(Number(b.mark)-Number(b.lic))

        },
        // {
        //     title: "Тикет/позиции/откр./ликвид./PNL",
        //     dataIndex: 'transaction',
        //     align: 'left',
        //      render: (text) =>
        //          text &&
        //          <table className="minitable">
        //
        //              {text.split(',').map(item=> (
        //                  <tr>
        //                      <td>{item.split(':')[0]}</td>
        //                      <td>{item.split(':')[1].split('/')[0]}</td>
        //                      <td>{item.split(':')[1].split('/')[1]}</td>
        //                      <td>{item.split(':')[1].split('/')[2]}</td>
        //                      <td>{item.split(':')[1].split('/')[3]}</td>
        //                  </tr>
        //
        //          ))}
        //          </table>
        //
        // },
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
            dataIndex: "status",
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
            dataIndex: "comment",
            render: (text, record) => {

                let textData= text.split('#')

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
                                    icon={(accountStore.loadingDataUser.loading && accountStore.loadingDataUser.userId===record.id)? <LoadingOutlined /> : <ReloadOutlined /> }
                                    onClick={event => accountStore.loadingGetData(record.id)}
                                    size="small"/>
                            {/*</NavLink>*/}

                        </Tooltip>


                        {record.status === "Активный" ? <Tooltip title="Исключить из мониторинга">

                                <Button shape="circle"
                                    //  onClick={() => onChange(record.id, {status: 'pause'})}
                                        onClick={event => accountStore.change(record.id, {status: "Активный"})}
                                        icon={<PauseOutlined/>}
                                        size="small"/>
                            </Tooltip> :
                            <Tooltip title="Активировать">
                                <Button shape="circle"
                                    // onClick={() => onChange(record.id, {status: 'play'})}
                                        onClick={event => accountStore.change(record.id, {status: "Исключен"})}
                                        icon={<CaretRightOutlined style={{color: '#4bdc0c'}}/>}
                                        size="small"/>
                            </Tooltip>}

                        <Tooltip title="Удалить">
                            {/*<NavLink to={`/request/${record.id}`}>*/}
                            <Button shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={event => accountStore.delete(record.id)}
                                    size="small"/>
                            {/*</NavLink>*/}

                        </Tooltip>

                    </Space>
                </>)
        },

    ]



    return (

        <>
            <div className="title">Аккаунты</div>
            <div className="contentOut">

                <Modal
                    title="Создать группу"
                    visible={activeAddGroup}
                   // okText="Create"
                    onCancel={onCancelModalGroup}
                    footer={[
                        <Button key="submit" type="primary" onClick={onCreateGroup}>
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
                            <Input placeholder="Введите название"/>
                        </Form.Item>
                        <Form.Item
                            label="Депозит"
                            name="balance"
                            rules={[{required: true, message: 'Введите значение'}]}
                        >
                            <InputNumber placeholder="1000" style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item
                            label="Статус"
                            name="status"
                            rules={[{required: true, message: 'Введите значение'}]}
                        >
                            <Select placeholder="Статус" >
                                <Select.Option value="Активный">Активный</Select.Option>
                                <Select.Option value="Пауза">Пауза</Select.Option>
                            </Select>
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
                            name="username"
                            rules={[{ required: true, message: 'Введите никнейм' }]}
                        >
                            <Input placeholder={"Введите имя"} />
                        </Form.Item>

                        <Form.Item
                            label="Выбор категории"
                            name="category"
                            rules={[{ required: true, message: 'Выберите категорию!' }]}
                        >
                            <Select placeholder="Выбрать">
                                <Select.Option value="humans">Люди</Select.Option>
                                <Select.Option value="bot">Роботы</Select.Option>

                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Выбор группы"
                            name="groupId"
                            rules={[{ required: true, message: 'Выберите группу!' }]}
                        >
                            <Select placeholder="Выбрать">
                                {groupStore.groups.map(group=> <Select.Option value={group.id}>{group.name}</Select.Option>)}


                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Никнейм в телеграмме для связи"
                            name="connection"
                            rules={[{ required: true, message: 'Введите никнейм телеграмма!' }]}
                        >
                            <Input  prefix="@" />
                        </Form.Item> <Form.Item
                        label="Api key (ключ с правами на чтение)"
                        name="apikey"
                        rules={[{ required: true, message: 'Вставьте API Key' }]}
                    >
                        <Input placeholder={"Введите ключ"} />
                    </Form.Item>
                        <Form.Item
                            label="Api Secret (секрет от ключа)"
                            name="apisecret"
                            rules={[{ required: true, message: 'Вставьте API Secret' }]}
                        >
                            <Input placeholder={"Введите секрет от ключа"} />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 11, span: 5 }}>
                            <Button disabled={accountStore.loading} type="primary" htmlType="submit">
                                Регистрация
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Button type="primary" onClick={() => setActiveAddGroup()}>Создать группу</Button >  <Tooltip title="Добавить">
                <Button  onClick={()=>setActiveAddUser()} type="primary">
                    <UserAddOutlined />
                </Button>

            </Tooltip> {groups.length > 0 &&
            <Button onClick={onUpdateGroup} type="primary">Обновить все</Button>}

                {groups.length > 0 ?
                    <div className="table-box">
                        <Table
                            scroll={{x: 700}}
                            loading={groupStore.loading}
                            expandable={{
                                expandedRowRender: group => {
                                    const humans = accountStore.accounts.length > 0 ? accountStore.accounts.filter(account => account.category === "humans" && account.groupId===group.id) : []
                                    const bot = accountStore.accounts.length > 0 ? accountStore.accounts.filter(account => account.category === "bot" && account.groupId===group.id): []

                                    const humansRevers = []
                                    const botRevers = [];

                                    humans && group.isRevers &&  humans.map(item=>{


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

                                    bot && group.isRevers && bot.map(item=>{

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
                                        <React.Fragment key={group.id}>
                                            <Button onClick={()=>onUpdateAccount(group.id)} type="primary">Обновить</Button>  <Tooltip title="Развернуть">
                                            <Button  onClick={()=>groupStore.changeRevers(group.id)}  >
                                                <SwapOutlined />
                                            </Button>

                                        </Tooltip>
                                            <div>
                                                <img className="icons" src={mans} alt="man"/>
                                            </div>

                                            <Table
                                                size="small"
                                                dataSource={group.isRevers ? humansRevers : humans}
                                                loading={accountStore.loading}
                                                columns={ group.isRevers ? subcolumnsRevers :subcolumns}
                                                onChange={onChangeTable}
                                            >

                                            </Table>

                                            <img className="icons" src={robots} alt="man"/>
                                            <Table
                                                size="small"
                                                dataSource={group.isRevers ? botRevers : bot}
                                                loading={accountStore.loading}
                                                columns={ group.isRevers ? subcolumnsRevers :subcolumns}
                                                onChange={onChangeTable}
                                            >
                                            </Table>

                                        </React.Fragment>
                                    )
                                },
                                defaultExpandedRowKeys: groups.filter(item=> item.status==="Активный").map(item=>item.id)

                            }}
                            dataSource={groups}
                            columns={columns}
                        >


                        </Table>

                    </div>

                    :  groupStore.loading ? <Loader/> :  <div className="imgBox">
                        <img className="img" src={logo} alt="Картинка"/>
                        <h1>Создайте группу для добавления аккаунтов</h1>
                    </div>
                }


            </div>
        </>

    )

});
