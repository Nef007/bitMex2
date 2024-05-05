module.exports = (sequelize, Sequelize) => {

    const Admin = sequelize.define('admin', {
        id: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        timeupdate: {
            type: Sequelize.INTEGER,
            defaultValue: 10000,


        }
    });

    return Admin;
}