const dbSeq = require("db/models/index");
const User = dbSeq.user
module.exports = async (role) =>{


        await User.update({
            role
        },{
            where:{
                change_role: true
            }
        })





}
