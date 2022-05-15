module.exports = (sequelize, Sequelize) => {

    const Log = sequelize.define('logs', {
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

    return Log;
}