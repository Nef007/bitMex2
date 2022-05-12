const dbSeq = require("db/models/index");
const User = dbSeq.user
const Notification = dbSeq.notification
const UserNotifi = dbSeq.user_notifi
const {Op} = require("sequelize");


class NotificationController {
    constructor(io) {
        this.io = io;
    }

    create = async (req, res) => {
        try {
            const {
                content,
                group,
                users
            } = req.body;

            const id = req.user.id

            const user = await User.findByPk(id)

            const notifi = await Notification.create({
                    content,
                    group: users ? String(users.map(item=> (item.label).split(' ')[0])) : group,
                    owner: `${user.family} ${user.name[0]}. ${user.patronymic[0]}.`
                }
            )

            const filterGroup = {
                status: {
                    [Op.not]: "Блокирован"
                }
            }

            if (group.includes("Пользователь")) {
                filterGroup.role = 'Пользователь'
            }
            if (group.includes("Оператор")) {
                filterGroup.role = 'Оператор'
            }
            if (group.includes("Администратор")) {
                filterGroup.role = 'Администратор'
            }
            if (group.includes("Выборочно")) {
                filterGroup.id = {
                    [Op.in]: users.map(item=> item.value)
                }
            }

            const usersFilter = await User.findAll({
                where: {
                    ...filterGroup
                }

            })

            for (let user of usersFilter) {
                user.addNotification(notifi)
            }


            this.io.emit("ADDED:NOTIFI");

            res.status(201).json({
                message: `Оповещение № ${notifi.id}  создано`,
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    notifis = async (req, res) => {
        try {

            const {pagination, filters = {}} = req.body

            //const {status, id, role, ...filter} = filters
            const minValue = pagination.current * pagination.pageSize - pagination.pageSize
            const maxValue = pagination.current * pagination.pageSize


            let notifis = await Notification.findAll({
                group: ["notification.id"],
                includeIgnoreAttributes: false,
                include: [{
                    model: User,
                }],
                attributes: ["id", "content", "group", "owner", "createdAt",
                    [dbSeq.sequelize.fn("COUNT", dbSeq.sequelize.col("users.id")), "count"],
                ],
                raw: true,
                // offset: minValue,
                // limit: pagination.pageSize,
                order: [
                    ['createdAt', 'DESC'],
                ],
            });


            let notifisCountSeen = await Notification.findAll({
                group: ["notification.id"],
                includeIgnoreAttributes: false,
                include: [{
                    model: User,
                }],
                attributes: ["id",
                    [dbSeq.sequelize.fn("COUNT", dbSeq.sequelize.col("users.id")), "count"],
                ],

                where: {
                    '$users.user_notifi.seen$': 1,
                    id:{
                        [Op.in]: notifis.map((item)=> item.id)
                    }
                },
                raw: true

            });

            for (let i of notifis) {
                for (let j of notifisCountSeen) {
                    if(i.id===j.id){
                        i.count_seen=j.count


                    }

                }
                i.users=[]
                if(!i.count_seen){
                    i.count_seen="0"
                }
            }


            const totalCount=notifis.length;
            notifis = notifis.slice(minValue, maxValue)


            res.json({notifis, totalCount});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    delete = async (req, res) => {
        try {
            const id = req.params.id;
            await Notification.destroy({
                where: {
                    id
                }
            })
            res.json({message: `Оповещение ${id} удалено`});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getUsers = async (req, res) => {
        try {

            const id = req.params.id;
            let users = await User.findAll({
                include: [{
                    model: Notification,
                    attributes: ['id'],
                    through: {
                        attributes: ['seen', 'updatedAt'],

                    },
                    where: {
                        '$notifications.user_notifi.notificationId$': id
                    }
                }],
                attributes: ['id', 'family', 'name', 'patronymic', 'email'],
                order: [
                    ['createdAt', 'DESC'],
                ],


            });



            res.json(users);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    // просмотр оповещения,
    seeNotifi = async (req, res) => {
        try {

            const {arrIdNotifi} = req.body;


            await UserNotifi.update({seen: 1}, {
                where: {
                    id: {
                        [Op.in]: arrIdNotifi
                    }
                }
            })

            res.status(201).json({message: "Прочитано"});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    getNotifisUserId = async (req, res) => {
        try {

            const id = req.user.id;
            const notifi =  await Notification.findAll({
                include: [{
                    model: User,
                    attributes:['id'],
                    where:{
                        id
                    },
                    through: {
                        attributes: ['id'],
                        where: {
                            seen: 0
                        }
                    },
                }],
                order: [
                    ['createdAt', 'DESC'],
                ],


            })

            res.status(201).json(notifi);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


}

module.exports = NotificationController;
