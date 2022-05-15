const bodyParser = require("body-parser");
const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const updateLastSeen = require("../middlewares/updateLastSeen");
const loginValidation = require("../utils/validations/login");
const registerValidation = require("../utils/validations/registration");
const passwordValidation = require("../utils/validations/checkPassword");
const path = require('path')


const UserCtrl = require("../controllers/UserController");
 const ToorCtrl = require("../controllers/ToorController");
 const NotificationCtrl = require("../controllers/NotificationController");
 const AccountCtrl = require("../controllers/AccountController");
 const AppCtrl = require("../controllers/AppController");
// const FileCtrl = require("../controllers/FileController");
// const StatCtrl = require("../controllers/StatisticController");
// const DcumCtrl = require("../controllers/DcumController");
// const SystemCtrl = require("../controllers/SystemController");

const fileUpload = require("express-fileupload");

const createRoutes = (app, io) => {
    const UserController = new UserCtrl(io);
     const ToorController = new ToorCtrl(io);
     const NotificationController = new NotificationCtrl(io);
     const AccountController = new AccountCtrl(io);
     const AppController = new AppCtrl(io);
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
     app.get("/user/me", checkAuth, updateLastSeen, UserController.me);
     app.post("/user/register/:from", registerValidation, UserController.register);
     app.post("/user/login", loginValidation, UserController.login);
     app.post("/users", checkAuth, updateLastSeen, UserController.users);
     app.delete("/user/:id", checkAuth, updateLastSeen, UserController.delete);
     app.put("/user/:id", passwordValidation, checkAuth, updateLastSeen, UserController.change);
     app.get("/user/:id", checkAuth, updateLastSeen, UserController.index);
     app.put("/user/setting/:id", checkAuth, updateLastSeen, UserController.changePersonal);
     app.get("/user/logs/:id",  UserController.getAllLogs);
    //
     app.get("/user/logs_file/:id",  UserController.getLogsFile);

     app.post("/toor", checkAuth, updateLastSeen, ToorController.create);
     app.put("/toor/:id", checkAuth, updateLastSeen, ToorController.change);
     app.get("/toors", checkAuth, updateLastSeen, ToorController.toors);
     app.delete("/toor/:id", checkAuth, updateLastSeen, ToorController.delete);

     app.post("/notifi/", checkAuth, updateLastSeen, NotificationController.create);
     app.post("/notifis/", checkAuth, updateLastSeen, NotificationController.notifis);
     app.delete("/notifi/:id", checkAuth, updateLastSeen, NotificationController.delete);
     app.get("/notifiusers/:id", checkAuth, updateLastSeen, NotificationController.getUsers);
     app.put("/notifi/",  NotificationController.seeNotifi);
     app.get("/notifi/",checkAuth, NotificationController.getNotifisUserId);


    // app.put("/glossary/new/:id", checkAuth, updateLastSeen, GlossaryController.changeNewWord);
    // app.get("/glossary/", GlossaryController.geGlossarySelect);
    // app.delete("/glossary/del", checkAuth, updateLastSeen,  GlossaryController.deleteWordGlossary);
    // app.put("/glossary/stat", checkAuth, updateLastSeen, GlossaryController.getGlossaryAdminStat);
    //
     app.post("/account", checkAuth, updateLastSeen, AccountController.create);
     app.get("/accounts", checkAuth, updateLastSeen,  AccountController.accounts);
     app.get("/account/:id", checkAuth, updateLastSeen, AccountController.getData);
     app.delete("/account/:id", checkAuth, updateLastSeen, AccountController.delete);
     app.put("/account/:id",  checkAuth, updateLastSeen,   AccountController.change);

    app.get("/logs", checkAuth, updateLastSeen, AppController.logs_all);
    app.delete("/logs", checkAuth, updateLastSeen, AppController.logs_delete);
     app.post("/version/", checkAuth, updateLastSeen, AppController.version_create);
     app.get("/versions/",   AppController.version_all);
     app.delete("/version/:id", checkAuth, updateLastSeen, AppController.version_delete);
     app.put("/version/:id",  checkAuth, updateLastSeen,   AppController.version_change);
     app.get("/version/:id",  checkAuth, updateLastSeen,   AppController.version_index);

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
