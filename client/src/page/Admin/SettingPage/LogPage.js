import React, {useEffect} from "react";

import moment from "moment";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../../../store";
import {Button, Input} from "antd";



export const LogPage = observer(() => {

    const {system} = useRootStore()

    useEffect(async () => {
        await   system.getLog()
    }, []);



    const textLod = system.log.map(item => `${item.text}---- ${moment(item.createdAt).format("HH:mm:ss DD.MM.YYYY")}`).join("\n")



    return (

        <>
            <div className="title">Лог</div>
            <div className="contentOut">
                <h2> Работа приложения</h2>
                <Button onClick={()=>system.deleteLog()} type="primary">
                    Отчистить лог
                </Button>  <Button onClick={()=>system.getLog()} type="primary">
                Обновить
            </Button> Строк: {system.log.length}

                <Input.TextArea rows={15} value={textLod}/>

            </div>
        </>

    );
});
