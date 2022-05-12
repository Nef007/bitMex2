module.exports = (sequelize, Sequelize) => {
    const Version = sequelize.define('versions', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        version: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,

        },


    },{ // options
        //timestamps: false,
       // freezeTableName: true,
    });


    return Version;
}