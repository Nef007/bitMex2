const checkServer = require("./utils/checkServer");
const changeRole = require("./utils/changeRole");
const moment = require("moment");



async function start() {

            await checkServer()
           // console.log(moment(new Date()).format("HH:mm DD.MM.YYYY"), "Проверен")

            if(new Date().getHours()===18 && new Date().getHours()<19 && new Date().getDay()!==0 && new Date().getDay()!==6 ){
                await changeRole("Оператор")
              //  console.log(moment(new Date()).format("HH:mm DD.MM.YYYY"), "Произошла смена роли на \"Пользователь_Оператор\"")
            }
            if(new Date().getHours()===9 && new Date().getHours()<10 && new Date().getDay()!==0 && new Date().getDay()!==6  ){
                await changeRole("Пользователь")
               // console.log(moment(new Date()).format("HH:mm DD.MM.YYYY"), "Произошла смена роли на \"Пользователь\"")
            }

            if(new Date().getDate()===1){
                await Log.destroy({
                    where: {},
                    truncate: true
                })
            }

    setTimeout(start,180000)



}


start();