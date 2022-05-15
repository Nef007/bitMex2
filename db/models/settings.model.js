

module.exports = (sequelize, Sequelize) => {
    const Settings = sequelize.define('settings', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        sound: {
            type: Sequelize.STRING,
            defaultValue:'droid'
        },
        theme: {
            type: Sequelize.STRING,
            defaultValue:'light'
        },



    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });



    return Settings;
}