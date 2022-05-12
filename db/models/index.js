
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};



let sequelize;
if (config.use_env_variable) {
  console.log(111)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {

  sequelize = new Sequelize(config.database, config.username, config.password, config);

  sequelize
      .authenticate()
      .then(() => console.log('Соединение с БД через Sequalize было успешно установлено1'))
      .catch((err) => console.error('Connection error: ', err))




}



fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname,  file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;




//Models/tables
//db.toors.hasMany(db.user, { onDelete: 'cascade' });



module.exports = db;