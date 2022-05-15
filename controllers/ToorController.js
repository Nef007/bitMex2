const dbSeq = require("../db/models/index");

const User = dbSeq.users
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
                name, balance, start: date.date[0], end: date.date[1], status
            })


            res.status(201).json({message: 'Турнир создан'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    change = async (req, res) => {
        try {
            const {id, date, ...value} = req.body
            await Toor.update({
                ...value,
                start:  date[0],
                end: date[1]
            }, {
                where:
                    {
                        id
                    },

            })

            if(date[0]){
                await User.update({starttoor: date[0] }, {
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

    toors = async (req, res) => {
        try {

            const toors = await Toor.findAll({
                order: [['start', 'DESC'] ],
                raw: true
            })

            for (let toor of toors) {

                //    const users = await User.findAll({
                //        where: {
                //            toorId: toor.id
                //        }
                //    })
                // sum=0
                //
                //    for (let user of users) {
                //        sum+= Number(user.balance)
                //    }
                //

                toor.turn = (await User.sum('balance', {
                    where: {
                        toorId: toor.id
                    }
                })).toFixed(4)

            }


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
