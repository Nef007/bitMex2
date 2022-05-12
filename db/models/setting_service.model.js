

module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define('setting', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        timeupdate: {
            type: Sequelize.INTEGER,
            defaultValue: 10000,


        },


    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });


    return Setting;
}