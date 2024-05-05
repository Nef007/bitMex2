
const env = {
    database: 'bitmex',
    username: 'root',
    password: '12345678',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};


const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
   // operatorsAliases: false,
    logging: false,
    dialectOptions: {
        supportBigNumbers: true
    },

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});

sequelize
    .authenticate()
    .then(() => console.log('Connect DB succes!'))
    .catch((err) => console.error('Connection error: ', err))



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.user = require('./models/user.model')(sequelize, Sequelize);
db.admin = require('./models/admin.model')(sequelize, Sequelize);
db.toor = require('./models/toor.model')(sequelize, Sequelize);
db.log = require('./models/log.model')(sequelize, Sequelize);

db.toor.hasMany(db.user, { onDelete: 'cascade' });



module.exports = db;