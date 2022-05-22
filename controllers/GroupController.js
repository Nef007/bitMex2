const dbSeq = require("../db/models/index");

const Account = dbSeq.accounts
const Group = dbSeq.groups





class GroupController {
    constructor(io) {
        this.io = io;
    }



    create = async (req, res) => {
        try {
            const {name, balance, status} = req.body
            const userId = req.user.id


            const candidate = await Group.findOne({
                where:
                    {
                        name,
                        userId
                    },
                raw: true
            })
            if (candidate) {
                res.status(400).json({message: 'Такая группа уже существует'})
            }


            await Group.create({
                name, balance, status, userId
            })


            res.status(201).json({message: 'Группа создана'})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    change = async (req, res) => {
        try {
            const { ...value} = req.body
            const id = req.params.id
            await Group.update({
                ...value,

            }, {
                where:
                    {
                        id
                    },

            })

            res.status(201).json({message: 'Сохранено'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    all = async (req, res) => {
        try {

            const userId = req.user.id

            const groups = await Group.findAll({
                include:[{
                    model: Account,

                }],
                attributes: {
                    include: [
                        [dbSeq.sequelize.literal(`(SELECT  SUM(balance) FROM accounts WHERE "accounts"."groupId" = groups.id)`,
                        ), 'turn'
                        ],]
                },
                where:{
                    userId
                },
                order: [['status', 'ASC'] ],
            })

            // for (let group of groups) {
            //
            //
            //     group.turn = (await Account.sum('balance', {
            //         where: {
            //             groupId: group.id
            //         }
            //     })).toFixed(4)
            //
            // }


            res.json(groups)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    //удаление   принимает токен
    delete = async (req, res) => {
        try {
            const id = req.params.id

            await Group.destroy({
                where: {
                    id
                }
            })


            res.status(201).json({message: 'Группа удалена'})
        } catch (e) {
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



}

module.exports = GroupController;
