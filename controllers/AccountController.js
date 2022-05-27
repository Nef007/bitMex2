
const moment = require('moment')
const dbSeq = require("../db/models/index");

const Account = dbSeq.accounts
const Toor = dbSeq.toors
const Group = dbSeq.groups
const {Op} = require("sequelize");

const request_bitmex = require("../utils/request_bitmex");
const logger = require("../utils/logs_app");





class AccountController {
    constructor(io) {
        this.io = io;
    }
    index = async (req, res) => {
        try {
            const id = req.params.id;

            let account = await Account.findOne({
                where: {
                    id
                },
            });

            if (!account) {
                return res.status(404).json({message: "Пользователь не найден"});
            }

            res.status(201).json(account);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    create = async (req, res) => {
        try {
            let userBit

            const {  groupId, ...account} = req.body

           // const group = await Group.findByPk(groupId)

            try {

                userBit = await request_bitmex(account.apikey, account.apisecret, 'GET', '/user',
                    {}
                );


            } catch (e) {

                return res.status(400).json({message: 'Ошибка получения данных c BitMex'})
            }


            const repit = await Account.findAll({
                where: {
                    [Op.and]: [{ groupId: groupId}, {idbitmex: String(userBit.id)}]
                },
                raw: true
            })

            if(repit.length){
                return res.status(400).json({message: `Пользователь уже существует в этой группе`})
            }


            await Account.create({
                ...account,
                idbitmex: userBit.id,
                groupId: groupId,
                userId: req.user.id
            })

            res.status(201).json({message: 'Зарегистрирован'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



    accounts = async (req, res) => {
        try {

            const userId = req.user.id
            const accounts = await Account.findAll({
                where:{
                    userId
                },
                order: [['balance', 'DESC'] ],
                raw: true
            })
            res.json(accounts)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    getData = async (req, res) => {
        try {

            const id = req.params.id

            const account = await Account.findByPk(id)


            try {
                // const wallet = await makeRequest(user.apikey, user.apisecret, 'GET', '/user/wallet',
                //     {currency: "XBt"}
                // );
                //
                //
                // // количество api
                // const api = await makeRequest(user.apikey, user.apisecret, 'GET', '/apiKey',
                //     {}
                // );
                //
                //
                // // в сделке
                // const positionBit = await makeRequest(user.apikey, user.apisecret, 'GET', '/position',
                //     {reverse: true}
                // );
                //
                //
                // ///  трейды  выводить по дате
                // const order = await makeRequest(user.apikey, user.apisecret, 'GET', '/order',
                //     {reverse: true, startTime: new Date(user.starttoor)}
                // );

                let wallet = ''
                let api = ''
                let positionBit = []
                let order = ''


                const arr = [
                    // await makeRequest(user.apikey, user.apisecret, 'GET', '/user/wallet',
                    //     {currency: "XBt"}
                    // ),
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
                        {reverse: true, filter:{"open": true}}
                    ),


                ]



                await Promise.all(arr)
                    .then(([response1, response2, response3, response4  ]) => {

                        wallet=response1
                      //  console.log(wallet)
                        api=response2
                        positionBit=response3
                        order=response4
                        console.log(order)


                    })
                    .catch(error => {
                        console.log('Ошибка получения данных')
                        throw error
                    })





                account.balance = wallet.amount
                account.trade = order.length
                account.transaction = String(positionBit.filter(item=>  item.avgEntryPrice!==null && item.liquidationPrice!==null ).map(item => `${item.symbol}: ${item.currentQty.toFixed(2)}/${item.avgEntryPrice.toFixed(2)}/${item.liquidationPrice.toFixed(2)}/${item.unrealisedPnl.toFixed(2)}/${item.markPrice.toFixed(2)}`)  || '')
                account.api = api.length
                account.comment = `Обновлен# ${new Date}`

                await Account.update({
                    // deposit: amount,
                    balance:  account.balance,
                    trade:  account.trade,
                    transaction: account.transaction,
                    api: account.api,
                    comment: `Обновлен:`

                }, {
                    where: {
                        id: account.id
                    }
                })

            } catch (e) {
                if (e.code === 403) {
                    account.balance = "H/В"
                    account.trade = "-"
                    account.transaction = ''
                }

                console.log(e)

                return  res.status(500).json({message: 'Не могу получить свежие данные'})


            }


            res.json(account)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



    getDataAll = async (req, res) => {
        try {

            const groupId = req.params.id==='undefined' ? undefined : req.params.id
            const userId = req.user.id

            let qweryPar={userId}
            if(groupId){
                qweryPar.groupId=groupId
            }

            console.log(qweryPar)

            const accounts = await Account.findAll({
                where:{
                    ...qweryPar
                }
            })


            for (let account of accounts) {

                if (account.status === "Активный") {


                    try {
                        // const wallet = await makeRequest(user.apikey, user.apisecret, 'GET', '/user/wallet',
                        //     {currency: "XBt"}
                        // );
                        //
                        //
                        // // количество api
                        // const api = await makeRequest(user.apikey, user.apisecret, 'GET', '/apiKey',
                        //     {}
                        // );
                        //
                        //
                        // // в сделке
                        // const positionBit = await makeRequest(user.apikey, user.apisecret, 'GET', '/position',
                        //     {reverse: true}
                        // );
                        //
                        //
                        // ///  трейды  выводить по дате
                        // const order = await makeRequest(user.apikey, user.apisecret, 'GET', '/order',
                        //     {reverse: true, startTime: new Date(user.starttoor)}
                        // );

                        let wallet = ''
                        let api = ''
                        let positionBit = []
                        let order = ''


                        const arr = [
                            // await makeRequest(user.apikey, user.apisecret, 'GET', '/user/wallet',
                            //     {currency: "XBt"}
                            // ),
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
                                {reverse: true, filter:{"open": true}}
                            ),


                        ]


                        await Promise.all(arr)
                            .then(([response1, response2, response3, response4]) => {

                                wallet = response1
                                //  console.log(wallet)
                                api = response2
                                positionBit = response3
                                order = response4



                            })
                            .catch(error => {
                                console.log('Ошибка получения данных')
                                throw error
                            })


                        account.balance = wallet.amount
                        account.trade = order.length
                        account.transaction = String(positionBit.filter(item => item.avgEntryPrice !== null && item.liquidationPrice !== null).map(item => `${item.symbol}: ${item.currentQty.toFixed(2)}/${item.avgEntryPrice.toFixed(2)}/${item.liquidationPrice.toFixed(2)}/${item.unrealisedPnl.toFixed(2)}/${item.markPrice.toFixed(2)}`) || '')
                        account.api = api.length
                        account.comment = `Обновлен# ${new Date}`

                        await Account.update({
                            // deposit: amount,
                            balance: account.balance,
                            trade: account.trade,
                            transaction: account.transaction,
                            api: account.api,
                            comment: `Обновлен:`

                        }, {
                            where: {
                                id: account.id
                            }
                        })

                    } catch (e) {
                        if (e.code === 403) {
                            account.balance = "H/В"
                            account.trade = "-"
                            account.transaction = ''
                        }
                        account.comment = "##Ошибка##!"

                        console.log(e)
                        await logger(`${e.code} Аккаунт: ${account.username} Пользователь: ${userId}` || `Неизвестная ошибка пользователь  Аккаунт: ${account.username} Пользователь: ${userId}`)


                    }

                }
            }


            res.json(accounts)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    change = async (req, res) => {
        try {

            let {...value} = req.body


            if(value.toorId){

               const toor = await Toor.findByPk(value.toorId)
                if(toor.status==="Активный" || toor.status==="Завершен" ){
                    return  res.status(400).json({message: 'Ошибка! турнир уже активный или завершен'})
                }

            if(toor.password && toor.password!==value.password){
                return  res.status(400).json({message: 'Пароль введен неверно!'})
            }



            }

            await Account.update({...value}, {
                where:
                    {
                        id: req.params.id
                    },

            })

            res.status(201).json({message: `Сохранено`})

        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    delete = async (req, res) => {
        try {

            await Account.destroy({
                where:
                    {
                        id: req.params.id
                    },

            })

            res.status(201).json({message: 'Пользователь удален'})
        } catch (e) {
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getInfo = async (req, res) => {
        try {

            let account ={
               // необработанные данные ордеров и баланса

            execution: [], //Получите все необработанные исполнения для своей учетной записи
                // {
                //     "execID": "string",
                //     "orderID": "string",
                //     "clOrdID": "string",
                //     "clOrdLinkID": "string",
                //     "account": 0,
                //     "symbol": "string",
                //     "side": "string",
                //     "lastQty": 0,
                //     "lastPx": 0,
                //     "underlyingLastPx": 0,
                //     "lastMkt": "string",
                //     "lastLiquidityInd": "string",
                //     "simpleOrderQty": 0,
                //     "orderQty": 0,
                //     "price": 0,
                //     "displayQty": 0,
                //     "stopPx": 0,
                //     "pegOffsetValue": 0,
                //     "pegPriceType": "string",
                //     "currency": "string",
                //     "settlCurrency": "string",
                //     "execType": "string",
                //     "ordType": "string",
                //     "timeInForce": "string",
                //     "execInst": "string",
                //     "contingencyType": "string",
                //     "exDestination": "string",
                //     "ordStatus": "string",
                //     "triggered": "string",
                //     "workingIndicator": true,
                //     "ordRejReason": "string",
                //     "simpleLeavesQty": 0,
                //     "leavesQty": 0,
                //     "simpleCumQty": 0,
                //     "cumQty": 0,
                //     "avgPx": 0,
                //     "commission": 0,
                //     "tradePublishIndicator": "string",
                //     "multiLegReportingType": "string",
                //     "text": "string",
                //     "trdMatchID": "string",
                //     "execCost": 0,
                //     "execComm": 0,
                //     "homeNotional": 0,
                //     "foreignNotional": 0,
                //     "transactTime": "2022-05-24T19:41:51.559Z",
                //     "timestamp": "2022-05-24T19:41:51.559Z"
                // }
            executionHistory: [], //Получить все исполнения, влияющие на баланс.
                // {
            //     "execID": "string",
            //     "orderID": "string",
            //     "clOrdID": "string",
            //     "clOrdLinkID": "string",
            //     "account": 0,
            //     "symbol": "string",
            //     "side": "string",
            //     "lastQty": 0,
            //     "lastPx": 0,
            //     "underlyingLastPx": 0,
            //     "lastMkt": "string",
            //     "lastLiquidityInd": "string",
            //     "simpleOrderQty": 0,
            //     "orderQty": 0,
            //     "price": 0,
            //     "displayQty": 0,
            //     "stopPx": 0,
            //     "pegOffsetValue": 0,
            //     "pegPriceType": "string",
            //     "currency": "string",
            //     "settlCurrency": "string",
            //     "execType": "string",
            //     "ordType": "string",
            //     "timeInForce": "string",
            //     "execInst": "string",
            //     "contingencyType": "string",
            //     "exDestination": "string",
            //     "ordStatus": "string",
            //     "triggered": "string",
            //     "workingIndicator": true,
            //     "ordRejReason": "string",
            //     "simpleLeavesQty": 0,
            //     "leavesQty": 0,
            //     "simpleCumQty": 0,
            //     "cumQty": 0,
            //     "avgPx": 0,
            //     "commission": 0,
            //     "tradePublishIndicator": "string",
            //     "multiLegReportingType": "string",
            //     "text": "string",
            //     "trdMatchID": "string",
            //     "execCost": 0,
            //     "execComm": 0,
            //     "homeNotional": 0,
            //     "foreignNotional": 0,
            //     "transactTime": "2022-05-24T19:40:40.563Z",
            //     "timestamp": "2022-05-24T19:40:40.563Z"
            // }
                funding: [],  //Получить историю финансирования. {
                // "timestamp": "2022-05-24T19:40:40.588Z",
                // "symbol": "string",
                // "fundingInterval": "2022-05-24T19:40:40.588Z",
                // "fundingRate": 0,
                // "fundingRateDaily": 0
           // }
                globalNotification: [] ,   //Получите ваши текущие GlobalNotifications {
            //     "id": 0,
            //     "date": "2022-05-24T19:40:40.602Z",
            //     "title": "string",
            //     "body": "string",
            //     "ttl": 0,
            //     "type": "success",
            //     "closable": true,
            //     "persist": true,
            //     "waitForVisibility": true,
            //     "sound": "string"
            // }
                order: [],// Заказы  {
            //     "orderID": "string",
            //     "clOrdID": "string",
            //     "clOrdLinkID": "string",
            //     "account": 0,
            //     "symbol": "string",
            //     "side": "string",
            //     "simpleOrderQty": 0,
            //     "orderQty": 0,
            //     "price": 0,
            //     "displayQty": 0,
            //     "stopPx": 0,
            //     "pegOffsetValue": 0,
            //     "pegPriceType": "string",
            //     "currency": "string",
            //     "settlCurrency": "string",
            //     "ordType": "string",
            //     "timeInForce": "string",
            //     "execInst": "string",
            //     "contingencyType": "string",
            //     "exDestination": "string",
            //     "ordStatus": "string",
            //     "triggered": "string",
            //     "workingIndicator": true,
            //     "ordRejReason": "string",
            //     "simpleLeavesQty": 0,
            //     "leavesQty": 0,
            //     "simpleCumQty": 0,
            //     "cumQty": 0,
            //     "avgPx": 0,
            //     "multiLegReportingType": "string",
            //     "text": "string",
            //     "transactTime": "2022-05-25T17:59:17.699Z",
            //     "timestamp": "2022-05-25T17:59:17.699Z"
            // }
                position: [], //Позиции    {
            //     "account": 0,
            //     "symbol": "string",
            //     "currency": "string",
            //     "underlying": "string",
            //     "quoteCurrency": "string",
            //     "commission": 0,
            //     "initMarginReq": 0,
            //     "maintMarginReq": 0,
            //     "riskLimit": 0,
            //     "leverage": 0,
            //     "crossMargin": true,
            //     "deleveragePercentile": 0,
            //     "rebalancedPnl": 0,
            //     "prevRealisedPnl": 0,
            //     "prevUnrealisedPnl": 0,
            //     "prevClosePrice": 0,
            //     "openingTimestamp": "2022-05-25T17:59:17.796Z",
            //     "openingQty": 0,
            //     "openingCost": 0,
            //     "openingComm": 0,
            //     "openOrderBuyQty": 0,
            //     "openOrderBuyCost": 0,
            //     "openOrderBuyPremium": 0,
            //     "openOrderSellQty": 0,
            //     "openOrderSellCost": 0,
            //     "openOrderSellPremium": 0,
            //     "execBuyQty": 0,
            //     "execBuyCost": 0,
            //     "execSellQty": 0,
            //     "execSellCost": 0,
            //     "execQty": 0,
            //     "execCost": 0,
            //     "execComm": 0,
            //     "currentTimestamp": "2022-05-25T17:59:17.796Z",
            //     "currentQty": 0,
            //     "currentCost": 0,
            //     "currentComm": 0,
            //     "realisedCost": 0,
            //     "unrealisedCost": 0,
            //     "grossOpenCost": 0,
            //     "grossOpenPremium": 0,
            //     "grossExecCost": 0,
            //     "isOpen": true,
            //     "markPrice": 0,
            //     "markValue": 0,
            //     "riskValue": 0,
            //     "homeNotional": 0,
            //     "foreignNotional": 0,
            //     "posState": "string",
            //     "posCost": 0,
            //     "posCost2": 0,
            //     "posCross": 0,
            //     "posInit": 0,
            //     "posComm": 0,
            //     "posLoss": 0,
            //     "posMargin": 0,
            //     "posMaint": 0,
            //     "posAllowance": 0,
            //     "taxableMargin": 0,
            //     "initMargin": 0,
            //     "maintMargin": 0,
            //     "sessionMargin": 0,
            //     "targetExcessMargin": 0,
            //     "varMargin": 0,
            //     "realisedGrossPnl": 0,
            //     "realisedTax": 0,
            //     "realisedPnl": 0,
            //     "unrealisedGrossPnl": 0,
            //     "longBankrupt": 0,
            //     "shortBankrupt": 0,
            //     "taxBase": 0,
            //     "indicativeTaxRate": 0,
            //     "indicativeTax": 0,
            //     "unrealisedTax": 0,
            //     "unrealisedPnl": 0,
            //     "unrealisedPnlPcnt": 0,
            //     "unrealisedRoePcnt": 0,
            //     "simpleQty": 0,
            //     "simpleCost": 0,
            //     "simpleValue": 0,
            //     "simplePnl": 0,
            //     "simplePnlPcnt": 0,
            //     "avgCostPrice": 0,
            //     "avgEntryPrice": 0,
            //     "breakEvenPrice": 0,
            //     "marginCallPrice": 0,
            //     "liquidationPrice": 0,
            //     "bankruptPrice": 0,
            //     "timestamp": "2022-05-25T17:59:17.796Z",
            //     "lastPrice": 0,
            //     "lastValue": 0
            // }
                user:{},
                affiliateStatus:{},
                commission: {},
                depositAddress: {},
                margin: {},
                minWithdrawalFee: {},
                tradingVolume: [],
                wallet: {},
                walletHistory: {},
                walletSummary: [],
            }


          const  acc = await Account.findByPk(req.user.id)


            const arr = [
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/execution',
                    {symbol: "XBT", reverse: true}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/execution/tradeHistory',
                    {symbol: "XBT", reverse: true}
                ),


                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/funding',
                    {symbol: "XBT", reverse: true}
                ),
                // await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/globalNotification',
                //
                // ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/order',
                    {symbol: "XBT", reverse: true}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/position',
                    {count: 100}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user',
                    {}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/affiliateStatus',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/commission',
                    {}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/depositAddress',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/margin',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/minWithdrawalFee',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/tradingVolume',
                    {}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/wallet',
                    {}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/walletHistory',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/walletSummary',
                    {currency: "XBt"}
                ),




            ]

            await Promise.all(arr)
                .then(([response1,
                            response2,
                           response3,
                         //  response4,
                           response5,
                            response6, response7, response8, response9, response10,
                            response11,response12, response13,response14,response15,response16,

                       ]) => {

                    account.execution=response1
                     account.executionHistory=response2
                    account.funding=response3
                   // account.globalNotification=response4
                    account.order=response5
                    account.position=response6
                    account.user=response7
                    account.affiliateStatus=response8
                    account.commission=response9
                    account.depositAddress=response10
                    account.margin=response11
                    account.minWithdrawalFee=response12
                    account.tradingVolume=response13
                    account.wallet=response14
                    account.walletHistory=response15
                    account.walletSummary=response16



                })
                .catch(error => {
                    console.log('Ошибка получения данных')
                    throw error
                })


            console.log(account)



            res.json(account);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };





}

module.exports = AccountController;
