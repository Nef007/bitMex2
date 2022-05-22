
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
                        {reverse: true, startTime: new Date(account.starttoor)}
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
                                {reverse: true, startTime: new Date(account.starttoor)}
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





}

module.exports = AccountController;
