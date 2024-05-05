module.exports = (sequelize, Sequelize) => {

    const Toor = sequelize.define('toor', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        start: {
            type: Sequelize.STRING,
            allowNull: false,

        } ,
        balance: {
            type: Sequelize.STRING,
            allowNull: false,

        } ,
        end: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,

        }
    });

    return Toor;
}