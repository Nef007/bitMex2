import React, {useEffect} from "react";
import { DatePicker,  Typography} from 'antd';

import {useRootStore} from "../../store";
import { observer} from "mobx-react-lite";


export const AccountPage = observer(props => {


    const { current_user} = useRootStore()



    useEffect( () => {


    }, [])





    return (

        <>
            <div className="title">Аккаунты</div>
            <div className="content">
                Аккаунты


            </div>
        </>

    )

});
