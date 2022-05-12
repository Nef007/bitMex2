const requestIp = require('request-ip');
module.exports = (req) =>{


    // return  req.headers['x-forwarded-for']?.split(',').shift()
    //     || req.socket?.remoteAddress

    return requestIp.getClientIp(req).split(":").reverse()[0]


}
