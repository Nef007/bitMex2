

module.exports = (sequelize, Sequelize) => {
    const UserNotifi = sequelize.define('user_notifi', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        seen: {
            type: Sequelize.INTEGER,
            defaultValue: 0

        }


    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });


    return UserNotifi;
}