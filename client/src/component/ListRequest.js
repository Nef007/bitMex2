import React from "react";
import {Avatar, List, Tag, Typography} from "antd";
import {NavLink} from "react-router-dom";
import request from "../asset/img/request.png";
import {getDate} from "../asset/utils/utils";

const {Text} = Typography;


export const ListRequest = ({listData = [], onListChange, pagination, loading, action=()=>[], search=''}) => {


    return (
        <List
            loading={loading}
            className="list"
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: page => {
                    onListChange({
                        current: page,
                        pageSize: 10,
                    })

                },
                ...pagination
            }}

            dataSource={listData}
            header={<div className="table_header">
                <div>Всего: {pagination.total}</div>
                {search}
                </div>

            }

            renderItem={item => (
                <List.Item
                    key={item.id}
                    actions={action(item)}

                    extra={
                        <NavLink to={`/svn/request/${item.id}`}>
                            <img
                            width={150}
                            height={150}
                            alt="img"
                            src={`${window.location.origin.replace("3000", "5000")}/${item.img_path}`}
                        />
                        </NavLink>

                    }
                >
                    <List.Item.Meta
                        avatar={
                            <NavLink to={`/svn/request/${item.id}`}>
                                <Avatar shape="square" size={50} src={request}/>
                            </NavLink>

                        }
                        title={<NavLink to={`/svn/request/${item.id}`}>Запрос № {item.id}</NavLink>}
                        description={<div className='description'>
                                    <span>
                                        <div><b>{item.type}</b></div>
                                        <div>
                                             {item.services.map(item =>
                                                 <Tag>
                                                     <div>{item.name}</div>
                                                 </Tag>
                                             )}
                                        </div>
                                        <div>{item.user.division}</div>
                                        <div>{item.mode}</div>
                                       <div>{item.user.family} {item.user.name[0]}. {item.user.patronymic[0]}.</div>
                                    </span>

                            <span className="time">
                                        <Text type="secondary">Создан: {getDate(item.createdAt)}</Text>
                                        <Text type="secondary">Статус: {item.status}</Text>
                                </span>
                        </div>}
                    />
                    {item.comment}
                </List.Item>
            )}
        />
    );
};
