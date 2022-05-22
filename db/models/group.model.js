module.exports = (sequelize, Sequelize) => {

    const Group = sequelize.define('groups', {
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

        balance: {
            type: Sequelize.STRING,
            allowNull: false,

        } ,

        status: {
            type: Sequelize.STRING,
            allowNull: false,

        }
    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });

    Group.associate = function(models) {

        Group.hasMany(models.accounts );

    };


    return Group;
}