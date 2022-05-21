const dbSeq = require("../db/models/index");
const Notification = dbSeq.notification
const Setting = dbSeq.settings
const User = dbSeq.users

const {Op} = require("sequelize");

module.exports = async (id, role) => {

    const notifi = await Notification.findAll({
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
            }
        }],

        order: [
            ['createdAt', 'DESC'],
        ],

    })

    const setting = await Setting.findOne({
        attributes: ['sound', "theme"],
            where:{
               userId: id
            },
        })





    return {notifi, setting,}

}

