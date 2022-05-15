const fs = require("fs");
const path = require('path')
const moment = require('moment')
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const dbSeq = require("../db/models/index");

const User = dbSeq.users
const Log = dbSeq.logs
const Setting = dbSeq.settings
const {Op} = require("sequelize");


const createJWTToken = require("../utils/createJWTToken");
const logs_user = require("../utils/logs_user");
const parseIp = require("../utils/parseIp");





class UserController {
    constructor(io) {
        this.io = io;
    }
    index = async (req, res) => {
        try {
            const id = req.params.id;

            let user = await User.findOne({
                include: [Setting],
                where: {
                    id
                },
            });

            if (!user) {
                return res.status(404).json({message: "Пользователь не найден"});
            }

            res.status(201).json(user);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    me = async (req, res) => {
        const id = req.user.id;

        try {

            let user = await User.findOne({
                where: {
                    id,
                    status: {
                        [Op.in]: [ 'Активный','Временный']
                    }
                }
            });

            if (!user) {
                return res.status(400).json({message: "Пользователь  заблокирован"});
            }

            const token = createJWTToken(user);

            user=user.purge()

            res.json({user, token});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    register = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации",
                });
            }

            const {
                email,
                status,
                password,
                ...value
            } = req.body;

            const from = req.params.from
            let hashedPassword
            if (password) {
                hashedPassword = await bcryptjs.hash(password, 12);
            }


            const user = await User.create({
                    ...value,
                    email: email,
                    status: from === 'new' ? "Новый" : status,
                    password: password && hashedPassword
                }
            )

            await logs_user("Зарегистрирован", user.id)

            await user.setSettings(await Setting.create())

            res.status(201).json({
                message: "Заявка успешно создана",
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    login = async (req, res) => {
        try {
            const {email, password} = req.body


            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные",
                });
            }


            let user = await User.findOne({
                where: {
                    email: email.trim(),
                    status: {
                        [Op.in]: [ 'Активный','Временный']
                    }
                },
            });

            if (!user) {
                return res.status(400).json({message: "Пользователь не найден или блокирован"});
            }

            //  если создан без пароля
            if (!user.password) {
                await logs_user("Попытка входа, \"Пользователь блокирован\"", user.id)
                return res
                    .status(400)
                    .json({message: "Пользователь блокирован"});
            }
            //Проверка пароля
            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                await logs_user(`Попытка входа, \"Неверный пароль\" (${password})`, user.id)
                return res
                    .status(400)
                    .json({message: "Неверный пароль, попробуйте снова"});
            }
            //  если статус блокирован
            if (user.status === "Блокирован") {
                await logs_user("Попытка входа, \"Пользователь блокирован\"", user.id)
                return res
                    .status(400)
                    .json({message: "Пользователь блокирован"});
            }



            const token = createJWTToken(user);
            user=user.purge()
            await logs_user(`Авторизация.(IP: ${parseIp(req)} )`, user.id)

            res.json({user, token});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    users = async (req, res) => {
        try {

            const {pagination, filters = {}, sortField='', sortOrder=''  } = req.body

            const {status, id, role, ...filter} = filters
            const minValue = pagination.current * pagination.pageSize - pagination.pageSize
           // const maxValue = pagination.current * pagination.pageSize

            const searchParams = {}
            if (status) {
                searchParams.status = {
                    [Op.in]: status
                }
            }
            if (role) {
                searchParams.role = {
                    [Op.in]: role
                }
            }
            if (id) {
                searchParams.id = id
            }

            for (let key in filter) {
                if (filters[key]) {
                    searchParams[key] = {
                        [Op.iLike]: `%${filters[key][0]}%`
                    }
                }
            }

            let order=[['createdAt', 'DESC'] ]

            if(sortOrder){
                order.unshift( [sortField, sortOrder==='descend'? 'DESC': 'ASC'])
            }

            let users = await User.findAndCountAll({
                attributes: {exclude: ['password']},
                where: {
                    ...searchParams
                },
                order,
                offset: minValue,
                limit: pagination.pageSize,

            });


            let totalCount = users.count
            users = users.rows

            res.json({users, totalCount});
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    //удаление   принимает токен
    delete = async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const user = await User.findOne({
                where: {
                    id
                },
                raw: true
            });

            if (!user) {
                return res.status(404).json({message: "Пользователь не найден"});
            }

            await User.destroy({
                where: {
                    id
                }
            })

            await logs_user(`Удалил пользователя:  ${user.family} ${user.name} ${user.patronymic} (IP: ${parseIp(req)})`, userId)
            res.json({message: `Пользователь ${user.family} удален`});
        } catch (e) {
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };


    change = async (req, res) => {
        try {
            const id = req.params.id;
            const {email}= req.user;
            let passwordChange;
            let {
                status,
                password,
                old_password,
                new_password,
                ...value

            } = req.body


            if (old_password) {

                const user = await User.findByPk(id)

                const isMatch = await bcryptjs.compare(old_password, user.password);
                if (!isMatch) {
                    return res
                        .status(400)
                        .json({message: "Старый пароль введен неверно!"});
                }

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),
                        message: "Должно быть: минимум 5 символов, 1 строчная , 1 ПРОПИСНАЯ, специальный . символ(@$.!%*#?&)",
                    });
                }

                passwordChange = await bcryptjs.hash(new_password, 12);
            }

            if (password) {
                password = await bcryptjs.hash(password, 12);
            }

            await User.update({
                ...value,
                status: password ? "Временный" : status ? status : "Активный",
                password: password ? password : passwordChange
            }, {
                where: {id},

            })

            await logs_user(`Изменение данных (${email} IP: ${parseIp(req)})`, id)
            res.json({message: `Пользователь  изменен`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    changePersonal = async (req, res) => {
        try {
            const id = req.params.id;
            let {
                sound,
                theme,
            } = req.body


            await Setting.update({
                sound,
                theme,
            }, {
                where: {id},

            })
            res.json({message: `Сохранено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getAllLogs= async (req, res) => {
        try {
            const id = req.params.id;

            let logs =   await Log.findAll({
                where: {
                    userId: id
                },
                limit: 15,
                order: [
                    ['createdAt', 'DESC'],
                ]

            })

            res.json(logs);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getLogsFile = async (req, res) =>  {
        try {
            const id = req.params.id;

            let logs =   await Log.findAll({
                where: {
                    userId: id
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                raw: true

            })

            logs = logs.map(item=> `${moment(Date.parse(item.createdAt)).format("DD.MM.YYYY HH:mm")}   ${item.text} `).join('\n')


            const pathLogs = path.join(__dirname, '../static/logsTemp.txt');

            // const writeableStream = await fs.createWriteStream(pathLogs);
            // await writeableStream.write(logs)

            fs.writeFile(pathLogs, logs, (err) => {
                if(err) throw err;

                res.contentType('application/octet-stream');
                return  res.sendFile(pathLogs);

            });


        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
}

module.exports = UserController;
