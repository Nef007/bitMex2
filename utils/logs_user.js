const dbSeq = require("db/models/index");
const Log = dbSeq.log
module.exports = async (text, userId, transaction={} ) =>{

    await Log.create({
        text,
        userId
    }, transaction)


}

