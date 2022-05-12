
const nodemailer = require('nodemailer')


let transporter = nodemailer.createTransport({
   // service: 'Yandex',
    host: 'post.mvd.ru',
    port: 587,
    secure: false,
    auth: {
        user: "-----",
        pass: "----",
    },
});



module.exports = transporter;




