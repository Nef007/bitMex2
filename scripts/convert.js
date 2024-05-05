const db = require('./db.config.js');
const dbSeq = require("../db/models/index");

const Account = dbSeq.accounts
const Group = dbSeq.groups

const ToorSQL = db.toor;
const UserSQL = db.user;



async function start() {
          const toors = await ToorSQL.findAll({raw:true})

    for(let toor of toors){

        let accounts= await UserSQL.findAll({where:{
            toorId: toor.id
            },
        raw: true})


        let group = await Group.create({
            name: toor.name,
            balance: toor.balance,
            status: "Активный",
            userId: 2
        },{
            returning: true
        })

        for(let account of accounts){

            await Account.create({
                username: account.username,
                idbitmex: account.idbitmex,
                connection: account.connection,
                category: account.category,
                apikey: account.apikey,
                apisecret: account.apisecret,

                groupId: group.id
            })

        }

    }
}

start()


