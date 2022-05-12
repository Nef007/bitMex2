module.exports = (sequelize, Sequelize) => {

    const Toor = sequelize.define('toors', {
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
    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });

    Toor.associate = function(models) {

        Toor.hasMany(models.user, {
            onDelete: 'cascade'
        });
    };


    return Toor;
}