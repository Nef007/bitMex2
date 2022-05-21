
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        family: {
            type: Sequelize.STRING,
            allowNull: false
        },
        patronymic: {
            type: Sequelize.STRING,
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

        User.hasMany(models.logs,
            {onDelete: 'cascade'});

        User.hasMany(models.accounts,
            {onDelete: 'cascade'});

        User.hasMany(models.toors,
            {onDelete: 'cascade'});

        User.belongsToMany(models.notification,
            {through: models.user_notifi});

        User.hasOne(models.settings,
            {onDelete: 'cascade'});

        User.hasMany(models.access_service,
            {onDelete: 'cascade'});
    };



    const secrets = [
        "password",
    ];





    User.prototype.purge = function() {
        const clean = {};
            for (const key of Object.keys(this.dataValues)) {
                if (!secrets.includes(key)) {
                    clean[key] = this.dataValues[key];
                }
            }
        return clean;
    };



    return User;
}