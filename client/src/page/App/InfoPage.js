import React, {useEffect} from "react";
import TradingViewWidget from 'react-tradingview-widget';



import {observer} from "mobx-react-lite";
import {isEmpty} from "lodash";

import {useRootStore} from "../../store";
import {useParams} from "react-router-dom";
import {Button, Table} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";




export const InfoPage = observer(props => {


    const {accountStore} = useRootStore()

    const linkId = useParams().id;

    useEffect( async () => {

        await accountStore.getInfo(linkId)

    }, [])


    let execution = []
    let executionHistory = []
    let funding = []
    let order = []
    let position = []
    let walletHistory = []
    let walletSummary = []
    let user = []

    if(!isEmpty(accountStore.account)){
        if(accountStore.account.execution.length>0){
            for (let i in accountStore.account.execution[0]) {

                execution.push({
                    title: i,
                    dataIndex: i,
                })

            }
        }
        if(accountStore.account.executionHistory.length>0){
        for (let i in accountStore.account.executionHistory[0]) {

            executionHistory.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.funding.length>0){
        for (let i in accountStore.account.funding[0]) {

            funding.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.order.length>0){
        for (let i in accountStore.account.order[0]) {

            order.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.position.length>0){
        for (let i in accountStore.account.position[0]) {

            position.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.walletHistory.length>0){
        for (let i in accountStore.account.walletHistory[0]) {

            walletHistory.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.walletSummary.length>0){
        for (let i in accountStore.account.walletSummary[0]) {

            walletSummary.push({
                title: i,
                dataIndex: i,
            })

        }
        }
        if(accountStore.account.user){

            for(let key in Object.entries(accountStore.account.user))
            {
                user.push(<div key={key}>{accountStore.account.user[key]}</div>);
            }




        }

    }




    return (
        <>
            <div className="title">Информация</div>
            <div className="contentCollum">
                <div>
                    <div>
                        {accountStore.account.user && Object.keys(accountStore.account.user).map(key =>{

                            if( typeof accountStore.account.user[key]=='object' &&  accountStore.account.user[key]){
                              return Object.keys(accountStore.account.user[key]).map(keyj =>{
                                  if( typeof accountStore.account.user[key][keyj]=='object' &&  accountStore.account.user[key][keyj]){


                                  }else

                                    return  <div key={keyj}>{keyj}: {accountStore.account.user[key][keyj]}</div>
                                })

                            }else
                                return  <div key={key}>{key}:  {accountStore.account.user[key]}</div>})
                        }
                    </div>
                    <div>depositAddress: {accountStore.account.depositAddress}</div>
                </div>

                <div className="title">Выполняющие ордеры</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={execution}
                           dataSource={accountStore.account.execution}
                    />
                    <div className="title">История ордеров</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={executionHistory}
                           dataSource={accountStore.account.executionHistory}
                    />
                    <div className="title">История финансирования свопов</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={funding}
                           dataSource={accountStore.account.funding}
                    />
                     <div className="title">Ордеры</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={order}
                           dataSource={accountStore.account.order}
                    />
                    <div className="title">Позиции</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={position}
                           dataSource={accountStore.account.position}
                    />
              <div className="title">История транзакций</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={walletHistory}
                           dataSource={accountStore.account.walletHistory}
                    />
                    <div className="title">Сводка транзакций</div>
                    <Table scroll={{x: 700 }}
                           size="small"
                           rowKey={record => record.id}
                           columns={walletSummary}
                           dataSource={accountStore.account.walletSummary}
                    />



                </div>


        </>

    );

});
