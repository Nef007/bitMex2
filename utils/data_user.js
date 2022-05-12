const dbSeq = require("db/models/index");
const Notification = dbSeq.notification
const Setting = dbSeq.setting
const User = dbSeq.user
const Service = dbSeq.service
const Request = dbSeq.request
const {Op} = require("sequelize");

module.exports = async (id, role,  accesses) => {

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

    const send =  await Request.count({
        where: {
           status: ["Ожидание", "На исполнении"],
            userId: id
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    })

    const response =  await Request.count({
        where: {
           status: ["Исполнен", "Отклонен"],
            userId: id,
            see: 0
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    })

 const estimates =  await Request.count({
     include: [ {
         model: Service,
         where: {
             estimation: {
                 [Op.is]: null
             },
             rezult:{
                 [Op.in]: ["получен", "ожидание эффективности"  ]
             }

         }
     },
         ],
     where: {
         userId: id,
         see: 1
     }
 })
    let wait=0
    let monitoring=0
    if(role==='Оператор'){
        let filterArr = []

        for(let serv of [...new Set(accesses.map(item=>item.service))]){
            let division = accesses.filter(item=>item.service===serv)

            filterArr.push({
                [Op.and]: [
                    {
                        '$services.name$': serv
                    },
                    {
                        '$user.division$': {
                            [Op.in]: division.map(item=>item.division)
                        }
                    }]
            })

        }

       let queryFilters={
            [Op.or]: [...filterArr]
        }

        try{
            wait =  await Request.count({
                distinct: true,
                where: {
                    ...queryFilters,
                     status: "Ожидание"
                },
                include: [{
                    model: User,

                },{
                    model: Service,

                }],

            })


            monitoring =  await Request.count({
                where: {
                    ...queryFilters,
                    type: "В режиме реального времени(Мониторинг)",
                    status: ['На исполнении'] ,
                },
                include: [{
                    model: User,

                },{
                    model: Service,

                }],

            })

        }catch (e) {
            console.log(e)
        }
    }



 const execut =  await Request.count({
        where: {
           status: ['На исполнении'] ,
            operator : `${id}`
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    })



    return {notifi, setting,   startState: {send, response, estimates, wait, execut, monitoring}}

}

