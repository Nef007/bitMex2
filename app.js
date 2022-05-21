require('dotenv').config()
const express = require("express");
const {createServer} = require("http");

const dbSeq = require("./db/models/index");
const User = dbSeq.users
const Setting = dbSeq.settings
const bool = false



dbSeq.sequelize.sync({force: bool}).then(async () => {
    console.log(`Drop and Resync with { force: ${bool} }`);

    const userAdmin = await User.findOne({where: {role: "Администратор"}})
    if (!userAdmin) {
        const user = await User.create({
            name: "Владислав",
            family: "Кайдалов",
            patronymic: "Эдуардович",
            email: "admin",
            password: "$2a$12$Xb8kN4fY6mLN5loroc9mteFZFlrYbOSPE2ZsI8MuoaI.FDPG0EhlK",
            role: 'Администратор',
            phone: "9507132745",
            status: "Активный",

        })
        await Setting.create({
            sound: "droid",
            theme: "light",
            userId: user.id
        })
    }
});



const createSocket = require("./core/socket");
const createRoutes = require("./core/routes");

const app = express();
const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);


async function connect() {
    try {

        http.listen(process.env.PORT, function () {
            console.log(`Сервер запушен на http://localhost:${process.env.PORT}`);
        });

       await process.send('ready')


    } catch (err) {
        console.error(err);
    }
}

connect();
