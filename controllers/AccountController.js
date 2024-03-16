const { Parser } = require ('json2csv');
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
            account.apikey=account.apikey.trim()
            account.apisecret=account.apisecret.trim()

            try {

                userBit = await request_bitmex(account.apikey, account.apisecret, 'GET', '/user' );


            } catch (e) {
                console.log(moment(Date.now()).format("HH:mm DD.MM.YYYY"),e)


                if (e.code === 401) {
                    return res.status(400).json({message: 'Ошибка получения данных c BitMex.  Invalid API Key.'})
                }else   return res.status(400).json({message: 'Ошибка получения данных c BitMex'})


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
                    await request_bitmex(account.apikey, account.apisecret, 'GET', '/order?filter=%7B%22open%22%3A%20true%7D',
                        {reverse: true, count: 100}
                    ),


                ]



                await Promise.all(arr)
                    .then(([response1, response2, response3, response4  ]) => {

                        wallet=response1
                      //  console.log(wallet)
                        api=response2
                        positionBit=response3
                        order=response4



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
                                {currency: "all"}
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
                        let a = 0

                        let balance = wallet.filter(item=>item.currency === 'USDt')[0]

                        if(balance){
                             a = Math.floor(balance.amount/1000000)
                        }

                         // использую что не делать миграцию
                        account.balance = a
                        account.comment_monit = wallet.map(item=> {

                            if(item.currency==='USDt'){
                                return `${item.currency}:${(item.amount/1000000).toFixed(2)}`
                            }


                            return `${item.currency}:${item.amount}`}).join(',')
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
                            comment: `Обновлен:`,
                            comment_monit: account.comment_monit

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


            execution: [],
            executionHistory: [],
                funding: [],
                globalNotification: [] ,
                order: [],
                position: [],
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


          const  acc = await Account.findByPk(req.params.id)




            const arr = [
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/execution',
                    { reverse: true}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/execution/tradeHistory',
                    { reverse: true}
                ),


                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/funding',
                    { reverse: true}
                ),

                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/order',
                    { reverse: true}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/position',
                    {count: 100}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user'

                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/affiliateStatus',
                    {currency: "XBt"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/commission'

                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/depositAddress',
                    {currency: "XBt", network: "btc"}
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/margin'

                ),
                // await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/minWithdrawalFee',
                //     {currency: "XBt", network: "btc"}
                // ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/tradingVolume'
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/wallet'
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/walletHistory'
                ),
                await request_bitmex(acc.apikey, acc.apisecret, 'GET', '/user/walletSummary'
                ),




            ]

            await Promise.all(arr)
                .then(([response1,
                            response2,
                           response3,
                         //  response4,
                           response5,
                            response6, response7, response8, response9, response10,
                            response11, response13,response14,response15,response16,

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
                   // account.minWithdrawalFee=response12
                    account.tradingVolume=response13
                    account.wallet=response14
                    account.walletHistory=response15
                    account.walletSummary=response16



                })
                .catch(error => {
                    console.log('Ошибка получения данных')
                    throw error
                })




            res.json(account);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    downloadToCsv = async (req, res) => {

        const  accounts = await Account.findAll({
            where: {
                userId:  req.user.id
            },
            raw: true
        })

        const opts = {
            fields: ['idbitmex', 'connection','username', 'category', 'deposit' , 'transaction', 'balance', 'comment_monit', 'apikey', 'apisecret', 'createdAt', 'updatedAt' ],
            withBOM: true,
        };

        const json2csv = new Parser(opts );
        const csv = json2csv.parse(accounts);

        res.header('Content-Type', 'text/csv');
        res.attachment("Выгрузка");
        return res.send(csv);
    }





}

module.exports = AccountController;
