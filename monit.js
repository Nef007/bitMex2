const dbSeq = require("./db/models/index");
const LogApp = dbSeq.logs_app
const Account = dbSeq.accounts
const SettingsApp = dbSeq.setting_app
const Toor = dbSeq.toors
const logger = require("./utils/logs_app");
const request_bitmex = require("./utils/request_bitmex");



async function start() {

    const toors = await Toor.findAll({
        raw: true
    })



    for (let toor of toors) {

        if (new Date(toor.start) > new Date()) {
            await Toor.update({status: 'Ожидание'}, {
                where: {
                    id: toor.id
                }
            })

        }

        // начало тура
        if (new Date(toor.start) <= new Date() && toor.status === "Ожидание") {


            // активировали тур

            await logger(`Start active turnament ${toor.id}`)
            await Toor.update({status: 'Активный'}, {
                where: {
                    id: toor.id
                }
            })
            // проверка пользователей
            const accounts = await Account.findAll({
                where: {
                    toorId: toor.id
                }
            })

            for (let account of accounts) {

                if (account.status_monit === "Активный") {
                    try {


                        let wallet = ''
                        let apibit = ''
                        let positionBit = []
                        let order = ''
                        let walletSum = ''


                        const arr = [
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/user/wallet',
                                {currency: "XBt"}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/apiKey'
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/position',
                                {reverse: true}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/order',
                                {reverse: true, startTime: new Date(toor.start)}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/user/walletSummary',
                                {currency: "XBt"}
                            )


                        ]

                        await Promise.all(arr)
                            .then(([response1, response2, response3, response4, response5  ]) => {

                                wallet=response1
                                apibit=response2
                                positionBit=response3
                                order=response4
                                walletSum=response5


                            })
                            .catch(error => {
                                console.log('Ошибка получения данных')
                                throw error
                            })


                        const {amount} = walletSum.filter(item => item.transactType === "Deposit")[0] || -1



                        let transaction = String(positionBit.filter(item=>  item.avgEntryPrice!==null && item.liquidationPrice!==null ).map(item => `${item.symbol}: ${item.currentQty.toFixed(2)}/${item.avgEntryPrice.toFixed(2)}/${item.liquidationPrice.toFixed(2)}/${item.unrealisedPnl.toFixed(2)}/${item.markPrice.toFixed(2)}`)  || '')
                        let balance = wallet.amount
                        let trade = order.length
                        let api = apibit.length



                        await Account.update({
                            deposit: amount,
                            balance,
                            trade,
                            transaction,
                            api,
                            comment_monit: `Обновлен:`

                        }, {
                            where: {
                                id: account.id
                            }
                        })

                        // }


                    } catch (e) {
                        if (e.code === 429) {
                            // console.log("Превышен интервал запросов, тур начнется позже")
                            // await Toor.update({ status_monit: 'Ожидание'}, {
                            //     where:{
                            //         id: toor.id
                            //     }
                            // })

                            await Account.update({status_monit: 'Исключен', comment_monit: "Превышен интервал запросов 429"}, {
                                where: {
                                    id: account.id
                                }
                            })


                        } else if (e.code === 403) {
                            await Account.update({status_monit: 'Исключен', comment_monit: "Ошибка доступа 403"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        } else {
                            await Account.update({status_monit: 'Исключен', comment_monit: "Ошибка получения данных"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        }

                        //   console.log(e)


                        await logger(e.code || "Ошибка получения данных")

                    }

                }

            }


            await logger(`Finish active turnament ${toor.id}`)

        }  // конец активации тура


        // конец тура
        if (new Date(toor.end) <= new Date() && toor.status === "Активный") {
            await logger(`Close turnament ${toor.id}`)
            // закрыли тур тур
            await Toor.update({status: 'Завершен'}, {
                where: {
                    id: toor.id
                }
            })
            // закрыть пользователей
            const accounts = await Account.findAll({
                where: {
                    toorId: toor.id
                }
            })


            for (let account of accounts) {

                if (account.status_monit === "Активный") {
                    try {


                        // const wallet = await request_bitmex(account.apikey, account.apisecret, 'GET', '/account/wallet',
                        //     {currency: "XBt"}
                        // );
                        // const order = await request_bitmex(account.apikey, account.apisecret, 'GET', '/order',
                        //     {reverse: true, startTime: new Date(toor.start)}
                        // );
                        // const api = await request_bitmex(account.apikey, account.apisecret, 'GET', '/apiKey',
                        //     {}
                        // );






                        let wallet = ''
                        let api = ''
                        let order = ''


                        const arr = [
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/user/wallet',
                                {currency: "XBt"}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/apiKey',
                                {}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/order',
                                {reverse: true, startTime: new Date(toor.start)}
                            ),


                        ]



                        await Promise.all(arr)
                            .then(([response1, response2, response3 ]) => {

                                wallet=response1
                                api=response2
                                order=response3


                            })
                            .catch(error => {
                                console.log('Ошибка получения данных')
                                throw error
                            })



                        let balance = wallet.amount
                        let trade = order.length

                        //записывает баланс, трайды, апи
                        await Account.update({
                            status_monit: 'Завершен',
                            balance,
                            trade,
                            api: api.length,
                            comment_monit: "Данные сохранены"
                        }, {
                            where: {
                                id: account.id
                            }
                        })


                    } catch (e) {
                        if (e.code === 429) {
                            // console.log("Превышен интервал запросов, тур закроется позже")
                            // await Toor.update({ status_monit: 'Активный'}, {
                            //     where:{
                            //         id: toor.id
                            //     }
                            // })

                            await Account.update({status_monit: 'Исключен', comment_monit: "Превышен интервал запросов 429"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        } else if (e.code === 403) {
                            await Account.update({status_monit: 'Завершен', comment_monit: "Ошибка доступа"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        } else {
                            await Account.update({status_monit: 'Завершен', comment_monit: "Ошибка получения данных"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        }
                        await logger(e)

                    }

                }


            }



            await logger(`Finish close turnament ${toor.id}`)

        }

    }

    setTimeout(start,10000)



}
async function cleanLog() {


    await LogApp.destroy({
        where: {},
        truncate: true})


    setTimeout(cleanLog,1209600000)



}



async function checkUser(){

    await logger("Cheks turnament...")
    const toors = await Toor.findAll({
        raw: true
    })

    const time =  (await SettingsApp.findOne({
        where: {
            id: 1,
        }
    })).timeupdate || 60


    for (let toor of toors) {

        //  проверка во время тура
        if (toor.status === "Активный") {

            await logger(`Cheks turnament id: ${toor.id}`)

            const accounts = await Account.findAll({
                where: {
                    toorId: toor.id
                }
            })

            for (let account of accounts) {

                if (account.status_monit === "Активный") {
                    try {

                        let wallet = ''
                        let apibit = ''
                        let positionBit = []
                        let order = ''
                        let walletSum = ''


                        const arr = [

                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/user/wallet',
                                {currency: "XBt"}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/apiKey',
                                {}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/position',
                                {reverse: true}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/order',
                                {reverse: true, startTime: new Date(toor.start)}
                            ),
                            await request_bitmex(account.apikey, account.apisecret, 'GET', '/user/walletSummary',
                                {currency: "XBt"}
                            )



                        ]



                        await Promise.all(arr)
                            .then(([response1, response2, response3, response4, response5 ]) => {

                                wallet=response1
                                apibit=response2
                                positionBit=response3
                                order=response4
                                walletSum=response5



                            })
                            .catch(error => {
                                console.log('Ошибка получения данных')
                                throw error
                            })





                        const {amount} = walletSum.filter(item => item.transactType === "Deposit")[0] || -2


                        // проверка депозита
                        if (amount !== Number(account.deposit)) {
                            await Account.update({status_monit: 'Исключен', comment_monit: "Депозит отличается"}, {
                                where: {
                                    id: account.id
                                }
                            })

                        }else {


                            let transaction = String(positionBit.filter(item=>  item.avgEntryPrice!==null && item.liquidationPrice!==null ).map(item => `${item.symbol}: ${item.currentQty.toFixed(2)}/${item.avgEntryPrice.toFixed(2)}/${item.liquidationPrice.toFixed(2)}/${item.unrealisedPnl.toFixed(2)}/${item.markPrice.toFixed(2)}`)  || '')
                            let balance = wallet.amount
                            let trade = order.length
                            let api = apibit.length


                            //записывает баланс, трайды, апи
                            await Account.update({
                                balance,
                                trade,
                                transaction,
                                api,
                                comment_monit: `Обновлен:`
                            }, {
                                where: {
                                    id: account.id
                                }
                            })



                        }


                    } catch (e) {
                        if (e.code === 429) {

                            await logger(e)
                        }
                        if (e.code === 403) {
                            await Account.update({
                                status_monit: 'Исключен',
                                comment_monit: "Ошибка получения депозита: Ошибка доступа 403"
                            }, {
                                where: {
                                    id: account.id
                                }
                            })

                        }


                        console.log(e)

                        await logger(`${e.code} ${account.username}` || `Неизвестная ошибка пользователь ${account.username}`)


                    }

                }

            }


            await logger(`uncheck turnament id: ${toor.id}`)
        }  // конец проверки во время тура
        // конец тура


    }


    await logger("Uncheks turnament..." )



    setTimeout(()=>checkUser(), time*60000)


}





start();
cleanLog();
checkUser();
