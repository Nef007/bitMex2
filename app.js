require('dotenv').config()
const express = require("express");
const {createServer} = require("http");



const bool = true
const dbSeq = require("./db/models/index");



dbSeq.sequelize.sync({force: bool}).then(async () => {
    console.log(`Drop and Resync with { force: ${bool} }`);
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
