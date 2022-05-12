
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            defaultValue: null
        }
        ,
        role: {
            type: Sequelize.STRING,

        },

        status: {
            type: Sequelize.STRING,
            defaultValue: 'Блокирован'

        },
        last_seen: {
            type: Sequelize.STRING,

        },
        

    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });


    User.associate = function(models) {

        User.hasMany(models.log, {
            onDelete: 'cascade'
        });
        User.belongsToMany(models.notification,
            {through: models.user_notifi});
    };



    return User;
}