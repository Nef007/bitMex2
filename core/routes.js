const bodyParser = require("body-parser");
const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const updateLastSeen = require("../middlewares/updateLastSeen");
const loginValidation = require("../utils/validations/login");
const registerValidation = require("../utils/validations/registration");
const passwordValidation = require("../utils/validations/checkPassword");
const path = require('path')


//const UserCtrl = require("../controllers/UserController");
// const RequestCtrl = require("../controllers/RequestController");
// const NotificationCtrl = require("../controllers/NotificationController");
// const GlossaryCtrl = require("../controllers/GlossaryController");
// const ServerCtrl = require("../controllers/ServerController");
// const FileCtrl = require("../controllers/FileController");
// const StatCtrl = require("../controllers/StatisticController");
// const DcumCtrl = require("../controllers/DcumController");
// const SystemCtrl = require("../controllers/SystemController");

const fileUpload = require("express-fileupload");

const createRoutes = (app, io) => {
   // const UserController = new UserCtrl(io);
    // const RequestController = new RequestCtrl(io);
    // const NotificationController = new NotificationCtrl(io);
    // const GlossaryController = new GlossaryCtrl(io);
    // const ServerController = new ServerCtrl(io);
    // const FileController = new FileCtrl(io);
    // const StatisticController = new StatCtrl(io);
    // const DcumController = new DcumCtrl(io);
    // const SystemController = new SystemCtrl(io);

    app.use(bodyParser.json());
   // app.use(express.urlencoded({ extended: true }));
    // app.use(checkAuth);
    //  app.use(updateLastSeen);



        app.use(express.static("/data/static/img"));
        app.use(express.static( "/data/static/files"));
        app.use(express.static(  "/data/static/response"));
        app.use(express.static("/data/static/document"));
        app.use(express.static("/data/static/document_delete"));

        app.use(express.static(__dirname + "/../static/img"))
        app.use(express.static(__dirname + "/../static/files"));
        app.use(express.static(__dirname + "/../static/response"));
        app.use(express.static(__dirname + "/../static/document"));



    app.use(fileUpload({}));



    console.log(process.env.NODE_ENV)

    if (process.env.NODE_ENV === 'production'){
        app.use('/', express.static(path.join(__dirname, '../isori', 'build')))
        app.get('/svn*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../isori', 'build', 'index.html'))
        })

    }

    // app.get("/user/me", checkAuth, updateLastSeen, UserController.me);
    // app.post("/user/register/:from", registerValidation, UserController.register);
    // app.post("/user/login", loginValidation, UserController.login);
    // app.post("/users", checkAuth, updateLastSeen, UserController.users);
    // app.delete("/user/:id", checkAuth, updateLastSeen, UserController.delete);
    // app.put("/user/:id", passwordValidation, checkAuth, updateLastSeen, UserController.change);
    // app.get("/user/:id", checkAuth, updateLastSeen, UserController.index);
    // app.put("/user/setting/:id", checkAuth, updateLastSeen, UserController.changePersonal);
    // app.get("/user/logs/:id",  UserController.getAllLogs);
    //
    // app.get("/user/logs_file/:id",  UserController.getLogsFile);
    //
    // app.post("/user/access/:id", checkAuth, updateLastSeen, UserController.createAccess);
    // app.delete("/user/access/:id", checkAuth, updateLastSeen, UserController.deleteAccess);
    // app.get("/user/access/:id", UserController.getAllAccess);
    //
    // app.post("/user/access_header/:id", checkAuth, updateLastSeen, UserController.createAccessHeader);
    // app.delete("/user/access_header/:id", checkAuth, updateLastSeen, UserController.deleteAccessHeader);
    // app.get("/user/access_header/:id", UserController.getAllAccessHeader);
    //
    // app.post("/user/access_static/:id", checkAuth, updateLastSeen, UserController.createAccessStatic);
    // app.delete("/user/access_static/:id", checkAuth, updateLastSeen, UserController.deleteAccessStatic);
    // app.get("/user/access_static/:id", UserController.getAllAccessStatic);

    //
    // app.post("/request/", checkAuth, updateLastSeen, RequestController.create);
    // app.post("/requests/:filter", checkAuth, updateLastSeen, RequestController.requests);
    // app.post("/requests/search/:filter", checkAuth, updateLastSeen, RequestController.search);
    // app.get("/request/info", checkAuth, RequestController.getInfoRequest);
    // app.get("/request/:id", checkAuth, updateLastSeen, RequestController.index);
    // app.put("/request/:id", checkAuth, updateLastSeen, RequestController.execut);
    // app.put("/request/see/:id", checkAuth, updateLastSeen, RequestController.see);
    // app.delete("/request/del/:id", checkAuth, updateLastSeen, RequestController.del);
    // app.put("/request/change/:id", checkAuth, updateLastSeen, RequestController.change);
    // app.delete("/request/delfile", checkAuth, updateLastSeen, RequestController.deleteFile);
    // app.put("/request/estimation/:id", checkAuth, updateLastSeen, RequestController.estimation);
    // app.put("/request/rezult/:id", checkAuth, updateLastSeen, RequestController.rezult);
    // app.get("/download/img/:id", checkAuth, updateLastSeen,  RequestController.downloadImg);
    //
    // app.post("/notifi/", checkAuth, updateLastSeen, NotificationController.create);
    // app.post("/notifis/", checkAuth, updateLastSeen, NotificationController.notifis);
    // app.delete("/notifi/:id", checkAuth, updateLastSeen, NotificationController.delete);
    // app.get("/notifiusers/:id", checkAuth, updateLastSeen, NotificationController.getUsers);
    // app.put("/notifi/",  NotificationController.seeNotifi);
    // app.get("/notifi/",checkAuth, NotificationController.getNotifisUserId);
    //
    //
    // app.post("/glossary/:glossary", checkAuth, updateLastSeen, GlossaryController.add);
    // app.get("/glossary/new", GlossaryController.geGlossaryNew);
    // app.delete("/glossary/new/", checkAuth, updateLastSeen, GlossaryController.deleteNewWord);
    // app.put("/glossary/new/:id", checkAuth, updateLastSeen, GlossaryController.changeNewWord);
    // app.get("/glossary/", GlossaryController.geGlossarySelect);
    // app.delete("/glossary/del", checkAuth, updateLastSeen,  GlossaryController.deleteWordGlossary);
    // app.put("/glossary/stat", checkAuth, updateLastSeen, GlossaryController.getGlossaryAdminStat);
    //
    // app.post("/server/", checkAuth, updateLastSeen, ServerController.create);
    // app.post("/servers/",   ServerController.servers);
    // app.delete("/server/:id", checkAuth, updateLastSeen, ServerController.delete);
    // app.post("/server/log/:id",  ServerController.getLog);
    // app.put("/server/:id",  checkAuth, updateLastSeen,   ServerController.change);
    // app.get("/server/:id",  checkAuth, updateLastSeen,   ServerController.index);
    //
    //
    // app.post("/version/", checkAuth, updateLastSeen, SystemController.version_create);
    // app.get("/versions/",   SystemController.version_all);
    // app.delete("/version/:id", checkAuth, updateLastSeen, SystemController.version_delete);
    // app.put("/version/:id",  checkAuth, updateLastSeen,   SystemController.version_change);
    // app.get("/version/:id",  checkAuth, updateLastSeen,   SystemController.version_index);
    //
    // app.post("/report",    ServerController.report);
    //
    // app.get("/download/:id", checkAuth, updateLastSeen,  FileController.downloadFile);
    //
    // app.post("/stat/user",  StatisticController.statUser);
    // app.post("/stat/all",  StatisticController.all);
    // app.post("/stat/dist",  StatisticController.statDevision);
    //
    // app.post("/document", checkAuth, updateLastSeen,  DcumController.create);
    // app.post("/document/stat_devision",   DcumController.statDevision);
    // app.post("/document/stat_section",   DcumController.statSection);
    // app.get("/document/start_duples",   DcumController.startDuples);
    // app.get("/document/all_duples",   DcumController.allDuples);




};

module.exports = createRoutes;
