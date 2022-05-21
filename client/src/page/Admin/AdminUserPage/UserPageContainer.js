import React, {useEffect, useState} from "react";
import {UserPage} from "./UserPage";
import {createPassword} from "../../../asset/utils/utils";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../../../store";
import {useParams,  useNavigate} from "react-router-dom";
import {Loader} from "../../../component/Loader";
import {Modal} from "antd";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";


export const UserPageContainer = observer (props => {
    const { users, system} = useRootStore()
    const linkId = useParams().id;
    const navigate= useNavigate()


    useEffect(async ()=>{
       await users.getUser(linkId)
        users.getLogs(linkId)
        users.getAllAccessService(linkId)
    },[])

    const [password, setPassword] = useState(undefined);

    const onBuildPassword = () => {
        setPassword(createPassword);
    };

    const onDeleteUser = () => {

        Modal.confirm({
            title: 'Удалить пользователя?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                users.delUser(linkId, ()=> navigate("../users"))
            },
        });

    };
    const onChangeUser = async (value) => {
       await users.changeUser(linkId, value)
    };

    // if(users.loading || !users.index_user){
    //     return <Loader/>
    // }
    return (
        <UserPage
            password={password}
            onBuildPassword={onBuildPassword}
            onChangeUser={onChangeUser}
            onDeleteUser={onDeleteUser}
            user={users.index_user}
            linkId={linkId}
            users={users}
            system={system}

        />
    );
})
