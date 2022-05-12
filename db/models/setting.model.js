

module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define('setting', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        sound: {
            type: Sequelize.TEXT,
            defaultValue:'droid'
        },
        theme: {
            type: Sequelize.TEXT,
            defaultValue:'light'
        },



    },{ // options
        //timestamps: false,
        freezeTableName: true,
    });



    return Setting;
}