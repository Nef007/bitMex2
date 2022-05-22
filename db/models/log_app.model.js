module.exports = (sequelize, Sequelize) => {

    const LogApp = sequelize.define('logs_app', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        text: {
            type: Sequelize.STRING,

        },
    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });

    return LogApp;
}