import React from 'react';
import {Badge, Button, Checkbox, Popover} from "antd";
import info from './img/info.png'




import './notifi.css'
import BellOutlined from "@ant-design/icons/lib/icons/BellOutlined";
import {getDate} from "../../asset/utils/utils";


const CheckboxGroup = Checkbox.Group;

export const Notification = ({data, onSee,  className}) => {

    const [checkedList, setCheckedList] = React.useState([]);
    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);


    const onChange = checkedValues => {
        setCheckedList(checkedValues);
        setIndeterminate(!!checkedValues.length && checkedValues.length < data.length);
        setCheckAll(checkedValues.length === data.length);
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? data.map(item => item.users[0].user_notifi.id) : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };


    const onClickSee = async () => {
       await  onSee(checkedList)
        setCheckedList([])
    };


    const content = () => {


        return <div className='notification-content'>
            <div className="notification-tools">
                <Button onClick={onClickSee} disabled={!checkedList.length} type='primary'>Прочитано</Button>
                <div>
                    <label> Выбрать все</label> <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange}
                                                          checked={checkAll}/>
                </div>
            </div>

            <ul className="notification-info-panel">
                <CheckboxGroup value={checkedList} onChange={onChange}>
                    {data.length ? data.map(item => {
                        return <li>
                            <div>
                                <div className='notification-box'>
                                    <div  className='notification-message'>
                                        <div>
                                            <img className="notification-icon" src={info}
                                                 alt="!"/>
                                        </div>

                                        <div className='message'>
                                            {item.content}
                                        </div>

                                        <div><Checkbox value={item.users[0].user_notifi.id}/></div>
                                    </div>
                                    <div className='notification-date'>
                                        {getDate(item.createdAt)}
                                    </div>


                                </div>

                            </div>

                        </li>
                    }
                    ) : <li>
                    <div className='message'>
                        нет информации
                    </div>

                </li>
                    }
                </CheckboxGroup>

            </ul>

        </div>
    }

    return (

        <Popover className={className} placement="bottomRight" content={content} trigger="click">
            <Badge count={data.length}>
                <BellOutlined onClick={e => e.preventDefault()} style={{fontSize: "20px"}}/>
            </Badge>
        </Popover>


    )
};