const bcryptjs = require("bcryptjs");
const createJWTToken = require("../utils/createJWTToken");
const {validationResult} = require("express-validator");
const dbSeq = require("db/models/index");
const fs = require("fs");
const User = dbSeq.user
const Log = dbSeq.log
const {Op} = require("sequelize");
const data_user = require("../utils/data_user");
const logs_user = require("../utils/logs_user");
const parseIp = require("../utils/parseIp");
const path = require('path')
const moment = require('moment')





class UserController {
    constructor(io) {
        this.io = io;
    }
    index = async (req, res) => {
        try {
            const id = req.params.id;

            //   /////  ДЛЯ ORACLE
            // let user = await simpleExecute(
            //     `select * from user_plane where  id=:id`,
            //     [id]);

            let user = await User.findOne({
                include: [Setting,  Request],
                attributes: {
                    include: [[dbSeq.sequelize.fn("COUNT", dbSeq.sequelize.col("requests.id")), "count_requests"]]
                },

                where: {
                    id
                },
                group: ['users.id', 'setting.id', 'requests.id'],
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
                 include:[AccessHeader],
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




            let servicesAccess = await ServicesAccess.findAll({
                where: {
                    userId: id,
                }
            });
            let accessStatistic = await AccessStatistic.findAll({
                where: {
                    userId: id,
                }
            });


            const dataInfo = await data_user(id, user.role,  servicesAccess)

            let userToken = user.purge()
            const token = createJWTToken(userToken);

            user=user.purge(true)

            user={...user, accesses: servicesAccess, access_statistics: accessStatistic  }

            res.json({user, dataInfo, token});
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
                    email: email + "@mvd.ru",
                    status: from === 'new' ? "Новый" : status,
                    password: password && hashedPassword
                }
            )

            await logs_user("Зарегистрирован", user.id)

            await user.setSetting(await Setting.create())

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
                include:[AccessHeader],
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



            let servicesAccess = await ServicesAccess.findAll({
                where: {
                    userId: user.id,
                }
            });
            let accessStatistic = await AccessStatistic.findAll({
                where: {
                    userId: user.id,
                }
            });

            const dataInfo = await data_user(user.id, user.role, servicesAccess)

            let userToken = user.purge()
            const token = createJWTToken(userToken);
            user=user.purge(true)
            await logs_user(`Авторизация.(IP: ${parseIp(req)} )`, user.id)


            user={...user, accesses: servicesAccess, access_statistics: accessStatistic  }

            res.json({user, dataInfo, token});
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

            // const totalCount = await User.count({
            //     attributes: {exclude: ['password']},
            //     where: {
            //         ...searchParams
            //     },
            // });

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
                is_notifi,
                email
            } = req.body


            await Setting.update({
                sound,
                theme,
                is_notifi,
                email

            }, {
                where: {id},

            })
            res.json({message: `Сохранено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    createAccess = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;

            let {
                service_access,
                division,
            } = req.body

           let arrAcces = []
            for (let service of service_access) {

                for (let div of division) {

                    try {
                        await ServicesAccess.create({
                            service: service.value,
                            division: div.value,
                            userId: id

                        })
                    }catch (e) {

                        if (e.parent.code === "23505"){
                            console.log("Повтор Доступа")
                        }else throw e
                    }
                    arrAcces.push(`${service.value}<=\n=>${div.value}`)
                }
            }

            await logs_user(`Добавлены доступы на просмотр заявок: \n ${arrAcces.join('\n')} (${email} IP: ${parseIp(req)})`, id)
            res.json({message: `Сохранено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    deleteAccess = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;
            let {
                deleteArray
            } = req.body

            let arrAccess =   await ServicesAccess.findAll({
                where: {
                    id:{
                        [Op.in] : deleteArray
                    }
                },

            })

            await ServicesAccess.destroy({
                where: {
                   id:{
                       [Op.in] : deleteArray
                   }
                }
            })

            await logs_user(`Удалены доступы на сервисы:\n ${arrAccess.map(item=>item.service).join('\n')} (${email} IP: ${parseIp(req)})`, id)
            res.json({message: `Удалено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getAllAccess = async (req, res) => {
        try {
            const id = req.params.id;

            let arrAccess =   await ServicesAccess.findAll({
                where: {
                    userId: id
                },

            })

            res.json(arrAccess);
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


    createAccessHeader = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;

            let {
                header_access,
            } = req.body

            let arrAccesHeader = []

                for (let service of header_access) {

                    try {
                        await AccessHeader.create({
                            service: service.value,
                            userId: id

                        })
                    }catch (e) {

                        console.log(e)

                        if (e.parent.code === "23505"){
                            console.log("Повтор Доступа")
                        }else throw e
                    }

                    arrAccesHeader.push(`${service.value}`)
                }

            await logs_user(`Добавлены доступы на сервисы:\n ${arrAccesHeader.join('\n')} (${email} IP: ${parseIp(req)})`, id)

            res.json({message: `Сохранено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    deleteAccessHeader = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;

            let {
                deleteArrayHeader
            } = req.body

         let arrAccessHeader =   await AccessHeader.findAll({
                where: {
                    id:{
                        [Op.in] : deleteArrayHeader
                    }
                },

            })

           await AccessHeader.destroy({
                where: {
                   id:{
                       [Op.in] : deleteArrayHeader
                   }
                },

            })

            await logs_user(`Удалены доступы на сервисы:\n ${arrAccessHeader.map(item=>item.service).join('\n')} (${email} IP: ${parseIp(req)})`, id)
            res.json({message: `Удалено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };

    getAllAccessHeader = async (req, res) => {
        try {
            const id = req.params.id;


            let arrAccessHeader =   await AccessHeader.findAll({
                where: {
                    userId: id
                },

            })


            res.json(arrAccessHeader);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    createAccessStatic = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;

            let {
                divisions,
            } = req.body

            let arrAccesStatistic = []

                for (let division of divisions) {

                    try {
                        await AccessStatistic.create({
                            division: division.value,
                            userId: id

                        })
                    }catch (e) {

                        console.log(e)

                        if (e.parent.code === "23505"){
                            console.log("Повтор Доступа")
                        }else throw e
                    }

                    arrAccesStatistic.push(`${division.value}`)
                }

            await logs_user(`Добавлены доступы на статистику:\n ${arrAccesStatistic.join('\n')} (${email} IP: ${parseIp(req)})`, id)

            res.json({message: `Сохранено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    deleteAccessStatic = async (req, res) => {
        try {
            const id = req.params.id;
            const {email} = req.user;

            let {
                deleteArrayStatic
            } = req.body

         let arrAccessStatic =   await AccessStatistic.findAll({
                where: {
                    id:{
                        [Op.in] : deleteArrayStatic
                    }
                },

            })

           await AccessStatistic.destroy({
                where: {
                   id:{
                       [Op.in] : deleteArrayStatic
                   }
                },

            })

            await logs_user(`Удалены доступы на статистику:\n ${arrAccessStatic.map(item=>item.division).join('\n')} (${email} IP: ${parseIp(req)})`, id)
            res.json({message: `Удалено`});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
    getAllAccessStatic = async (req, res) => {
        try {
            const id = req.params.id;


         let arrAccessStatic =   await AccessStatistic.findAll({
                where: {
                    userId: id
                },

            })


            res.json(arrAccessStatic);
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

            // const fileStream =  await fs.createReadStream('logs.txt');
            //


            // fileStream.pipe(res);
        //  return  res.sendFile(pathLogs);

        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что то пошло не так попробуйте снова"});
        }
    };
}

module.exports = UserController;
