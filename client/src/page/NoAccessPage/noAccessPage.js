import {Button} from "antd";
import React from "react";
import {useRootStore} from "../../store";
import {observer} from "mobx-react-lite";


export const NoAccessPage = observer(() => {

    const {current_user} = useRootStore()

    return (
        <div className='authBox'>
            <div className="noaccessBlock">
                <div className="noaccessBox">
                    <div className="noaccessText">
                        Нет доступа к этому сервису!
                    </div>
                    <div className="noaccessBtn">
                        <Button
                            type='primary'
                            href='/'
                        >
                            На главную
                        </Button>
                    </div>
                    <div className="noaccessBtn">
                        <Button
                            onClick={() => current_user.logout()}
                            type='primary'
                            href='/'
                        >
                            Выйти из системы({current_user.user.email})
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
});
