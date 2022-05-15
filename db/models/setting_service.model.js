

module.exports = (sequelize, Sequelize) => {
    const SettingApp = sequelize.define('setting_app', {
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


    return SettingApp;
}