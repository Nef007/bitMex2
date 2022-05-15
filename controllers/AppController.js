
const dbSeq = require("../db/models/index");
const Log = dbSeq.logs
const Version = dbSeq.versions
const User = dbSeq.users
const {Op} = require("sequelize");








class AppController {
    constructor(io) {
        this.io = io;
    }


    logs_all = async (req, res) => {
        try {

            const logs= await Log.findAll({
                order: [['createdAt', 'DESC'] ],
                raw: true
            })

            res.status(201).json(logs)

        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };



    logs_delete = async (req, res) => {
        try {

            await Log.destroy({
                where: {},
                truncate: true})

            res.status(201).json({message: 'Лог отчищен'})

        } catch (e) {
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };






    version_create = async (req, res) => {
        try {
            let {...form} = req.body;

            await Version.create({...form})
            const notifi = await Notification.create({
                    content: `Приложение обновлено до версии ${form.version}!\nподробнее об изменениях в меню "О приложении"`,
                    group: "Все",
                    owner: "Система"
                }
            )
            const filterGroup = {
                status: {
                    [Op.not]: "Блокирован"
                }
            }

            const usersFilter = await User.findAll({
                where: {
                    ...filterGroup
                }
            })

            for (let user of usersFilter) {
                await  user.addNotification(notifi)
            }

            this.io.emit("ADDED:NOTIFI");

            res.status(201).json({
                message: `Запись и оповещение созданы `,
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    version_all = async (req, res) => {
        try {

            let versions = await Version.findAll({
                order: [
                    ['createdAt', 'DESC'],
                ],
                raw: true
            });

            res.json(versions);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    version_index = async (req, res) => {
        try {
            const id = req.params.id
            const version = await Version.findByPk(id);

            res.json(version);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    version_change = async (req, res) => {
        try {

            const id = req.params.id
            const value = req.body.form

            await Version.update({
                    ...value,
                },
                {
                    where: {
                        id
                    }
                });
            res.json({message: `Запись изменена`});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    version_delete = async (req, res) => {
        try {
            const id = req.params.id;
            await Version.destroy({
                where: {
                    id
                }
            })
            res.json({message: `Запись удалена`});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };





}

module.exports = AppController;
