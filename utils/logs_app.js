const dbSeq = require("../db/models/index");
const LogApp = dbSeq.logs_app
module.exports = async (str) =>{

    let text = String(str)

    await LogApp.create({text})


}

