const fs = require("fs");
const path = require('path')
const moment = require('moment')
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const dbSeq = require("../db/models/index");

const Account = dbSeq.accounts
const Toor = dbSeq.toors
const {Op} = require("sequelize");


const createJWTToken = require("../utils/createJWTToken");
const logs_user = require("../utils/logs_user");
const parseIp = require("../utils/parseIp");
const request_bitmex = require("../utils/request_bitmex");





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

            const { isAdmin, toorid, ...user} = req.body

            const toor = await Toor.findByPk(toorid)

            try {

                userBit = await request_bitmex(user.apikey, user.apisecret, 'GET', '/user',
                    {}
                );


            } catch (e) {


                return res.status(400).json({message: 'Ошибка получения данных c BitMex'})
            }



            const repit = await Account.findAll({
                where: {
                    [Op.and]: [{ toorId: toorid}, {idbitmex: userBit.id}]
                },
                raw: true
            })

            if(repit.length){
                return res.status(400).json({message: `Пользователь уже существует в этом турнире`})
            }

            if(!isAdmin){
                if(toor.status==="Активный" || toor.status==="Завершен" ){
                    return res.status(400).json({message: `Регистрация невозможна! турнир уже начался или завершен`})
                }
            }


            toor.createAccounts({...user, starttoor: toor.start, idbitmex: userBit.id})

            res.status(201).json({message: 'Зарегистрирован'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



    accounts = async (req, res) => {
        try {
            const accounts = await Account.findAll({
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

            const user = await User.findByPk(id)


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
                    await makeRequest(user.apikey, user.apisecret, 'GET', '/user/wallet',
                        {currency: "XBt"}
                    ),
                    await makeRequest(user.apikey, user.apisecret, 'GET', '/apiKey',
                        {}
                    ),
                    await makeRequest(user.apikey, user.apisecret, 'GET', '/position',
                        {reverse: true}
                    ),
                    await makeRequest(user.apikey, user.apisecret, 'GET', '/order',
                        {reverse: true, startTime: new Date(user.starttoor)}
                    ),


                ]



                await Promise.all(arr)
                    .then(([response1, response2, response3, response4  ]) => {

                        wallet=response1
                        console.log(wallet)
                        api=response2
                        positionBit=response3
                        order=response4


                    })
                    .catch(error => {
                        console.log('Ошибка получения данных')
                        throw error
                    })





                user.balance = wallet.amount
                user.trade = order.length
                user.transaction = String(positionBit.filter(item=>  item.avgEntryPrice!==null && item.liquidationPrice!==null ).map(item => `${item.symbol}: ${item.currentQty.toFixed(2)}/${item.avgEntryPrice.toFixed(2)}/${item.liquidationPrice.toFixed(2)}/${item.unrealisedPnl.toFixed(2)}/${item.markPrice.toFixed(2)}`)  || '')
                user.api = api.length
                user.comment = `Обновлен# ${new Date}`

                await User.update({
                    // deposit: amount,
                    balance:  user.balance,
                    trade:  user.trade,
                    transaction: user.transaction,
                    api: user.api,
                    comment: `Обновлен:`

                }, {
                    where: {
                        id: user.id
                    }
                })

            } catch (e) {
                if (e.code === 403) {
                    user.balance = "H/В"
                    user.trade = "-"
                    user.transaction = ''
                }

                console.log(e)

                return  res.status(500).json({message: 'Не могу получить свежие данные'})


            }


            res.json(user)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    change = async (req, res) => {
        try {

            let comment = req.body.text

            await Account.update({status: "Исключен", comment}, {
                where:
                    {
                        id: req.params.id
                    },

            })

            res.status(201).json({message: 'Пользователь исключен'})

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
