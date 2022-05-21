

module.exports = (sequelize, Sequelize) => {
    const AccessService = sequelize.define('access_service', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        service: {
            type: Sequelize.STRING,
             allowNull: false
        },




    },{ // options
        //timestamps: false,
       // freezeTableName: true,
    });


    return AccessService;
}