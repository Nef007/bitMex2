

module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define('notification', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        group: {
            type: Sequelize.TEXT,
            allowNull: false
        } ,
        owner: {
            type: Sequelize.TEXT,
            allowNull: false
        }

    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });


    return Notification;
}