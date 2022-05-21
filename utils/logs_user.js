const dbSeq = require("../db/models/index");
const Log = dbSeq.logs
module.exports = async (text, userId, transaction={} ) =>{

    await Log.create({
        text,
        userId
    }, transaction)


}

