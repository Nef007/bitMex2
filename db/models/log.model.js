module.exports = (sequelize, Sequelize) => {

    const Log = sequelize.define('log', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        text: {
            type: Sequelize.STRING,

        },
    });

    return Log;
}