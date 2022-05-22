const dbSeq = require("../db/models/index");

const Account = dbSeq.accounts
const Toor = dbSeq.toors





class ToorController {
    constructor(io) {
        this.io = io;
    }
    index = async (req, res) => {
        try {
            const id = req.params.id;

            let toor = await Toor.findOne({
                where: {
                    id
                },
            });

            if (!toor) {
                return res.status(404).json({message: "Турнир не найден"});
            }

            res.status(201).json(toor);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    create = async (req, res) => {
        try {
            const {name, balance, ...date} = req.body
            let status
            const userId = req.user.id


            const candidate = await Toor.findOne({
                where:
                    {
                        name
                    },
                raw: true
            })
            if (candidate) {
                res.status(400).json({message: 'Такой турнир уже существует'})
            }

            if (new Date(date.date[0]) < new Date() && new Date(date.date[1]) > new Date()) {
                status = "Активный"
            } else if (new Date(date.date[0]) > new Date()) {
                status = "Ожидание"
            } else status = "Завершен"

            await Toor.create({
                name,
                balance,
                start: date.date[0],
                end: date.date[1],
                status,
                userId
            })


            res.status(201).json({message: 'Турнир создан'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    change = async (req, res) => {
        try {
            const { date, ...value} = req.body
            const id = req.params.id


            if(date){
                value.start=date[0]
                value.end=date[1]
            }


            await Toor.update({
                ...value,
            }, {
                where:
                    {
                        id
                    },

            })

            if(date){
                await Account.update({starttoor: date[0] }, {
                        where:{
                            toorId: id
                        }
                    }

                )
            }


            res.status(201).json({message: 'Сохранено'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    all = async (req, res) => {
        try {

            const toors = await Toor.findAll({
                include:[ Account],
                attributes: {
                    include: [
                        [dbSeq.sequelize.literal(`(SELECT  SUM(balance) FROM accounts WHERE "accounts"."toorId" = toors.id)`,
                        ), 'turn'
                        ],]
                },
                order: [['start', 'DESC'] ],
            })

            // for (let toor of toors) {
            //
            //     toor.turn = (await Account.sum('balance', {
            //         where: {
            //             toorId: toor.id
            //         }
            //     })).toFixed(4)
            //
            // }


            res.json(toors)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    myAll = async (req, res) => {
        try {

            const userId = req.user.id

            const toors = await Toor.findAll({
                include:[{
                    model: Account,
                    attributes: [],
                    where:{
                        userId
                    }
                }],
                attributes: {
                    include: [
                        [dbSeq.sequelize.literal(`(SELECT  SUM(balance) FROM accounts WHERE "accounts"."toorId" = toors.id)`,
                        ), 'turn'
                        ],

                    ]
                },
                order: [['start', 'DESC'] ],
                raw: true


            })

            for (let toor of toors) {

                toor.accounts = await Account.findAll({
                    where:{
                        toorId: toor.id
                    }
                })



           }

            res.json(toors)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    adminAll = async (req, res) => {
        try {

            const toors = await Toor.findAll({
                include:[{
                    model: Account,
                }],
                attributes: {
                    include: [
                        [dbSeq.sequelize.literal(`(SELECT  SUM(balance) FROM accounts WHERE "accounts"."toorId" = toors.id)`,
                        ), 'turn'
                        ],]
                },
                order: [['start', 'DESC'] ],

            })
            res.json(toors)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    //удаление   принимает токен
    delete = async (req, res) => {
        try {
            const id = req.params.id

            await Toor.destroy({
                where: {
                    id
                }
            })


            res.status(201).json({message: 'Турнир удален'})
        } catch (e) {
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



}

module.exports = ToorController;
