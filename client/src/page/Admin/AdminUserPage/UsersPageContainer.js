import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {UsersPage} from "./UsersPage";
import {createPassword} from "../../../asset/utils/utils";
import {useRootStore} from "../../../store";
import {observer} from "mobx-react-lite";
import moment from "moment";
import {Button, Input, Space, Tag, Tooltip} from "antd";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from 'react-highlight-words';
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";


export const UsersPageContainer = observer((props) => {


    const {users, current_user} = useRootStore()

    useEffect(async () => {
        await users.getUsers();
    }, []);


    const [activeUserAddedModal, setActiveUserAddedModal] = useState(false);
    const [password, setPassword] = useState(undefined);


    const onActiveUserAddedModal = () => {
        setActiveUserAddedModal(!activeUserAddedModal);
        setPassword(undefined);
    };


    const onBuildPassword = () => {
        setPassword(createPassword);
    };

    const onRegister = async (value) => {
        await current_user.register("adm", value);
        await users.getUsers();
    };

    const onTableChange = async (pagination, filters, sorter) => {

        await users.getUsers({
            sortField: sorter.field,
            sortOrder: sorter.order,
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
            title: "Действие",
            render: (record) =>
                <Space size="middle">
                    <Link to={`/admin/user/${record.id}`}>
                        <Tooltip title="Просмотр">
                            <Button shape="circle" icon={<EyeOutlined/>}
                                    size="large"/>
                        </Tooltip>
                    </Link>
                </Space>,

          //  width: 85,


        },

        {
            title: "id",
            dataIndex: "id",
            ...getColumnSearchProps('id'),
          //  width: 50,

        }, {
            title: "Фамилия",
            dataIndex: "family",
            ...getColumnSearchProps('family'),
           // width: 100,

        }, {
            title: "Имя",
            dataIndex: "name",
            ...getColumnSearchProps('name'),
          //  width: 70,

        }, {
            title: "Отчество",
            dataIndex: "patronymic",
            ...getColumnSearchProps('patronymic'),
          //  width: 100,

        },
      {
            title: "Email",
            dataIndex: "email",
            ...getColumnSearchProps('email'),
           // width: 100,

        }, {
            title: "Роль",
            dataIndex: "role",
            filters: [
                {text: 'Пользователь', value: 'Пользователь'},
                {text: 'Администратор', value: 'Администратор'},
                {text: 'Оператор', value: 'Оператор'},

            ],
          //  width: 70,

        }, {
            title: "В сети",
            dataIndex: "last_seen",
            render: (text) => (
                text && moment(+text).format("HH:mm DD.MM.YY")
            ),
            sorter: true,
           // width: 75
        }, {
            title: "Контакты",
            dataIndex: "phone",
            ...getColumnSearchProps('phone'),
         //   width: 100,

        }, {
            title: "Статус",
            dataIndex: "status",
            filters: [
                {text: 'Новый', value: 'Новый'},
                {text: 'Временный', value: 'Временный'},
                {text: 'Активный', value: 'Активный'},
                {text: 'Блокирован', value: 'Блокирован'},
            ],
            render: (text) =>
                <Space size="middle">
                    <Tag
                        color={text === "Активный" ? "green" : text === "Временный" ? "gold" : text === "Новый" ? "blue" : "red"}>
                        {text}
                    </Tag>
                </Space>,


        }

    ];


    return (
        <UsersPage
            loading={users.loading}
            columns={columns}
            users={users.users}
            activeUserAddedModal={activeUserAddedModal}
            onActiveUserAddedModal={onActiveUserAddedModal}
            onBuildPassword={onBuildPassword}
            password={password}
            onRegister={onRegister}
            onTableChange={onTableChange}
            pagination={users.pagination}
            total={users.pagination.total}


        />

    );
});
