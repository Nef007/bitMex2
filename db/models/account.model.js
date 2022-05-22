module.exports = (sequelize, Sequelize) => {
    const Accounts = sequelize.define('accounts', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idbitmex: {
            type: Sequelize.STRING,
            allowNull: false
        },
        connection: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        deposit: {
            type: Sequelize.STRING,


        },
        transaction: {
            type: Sequelize.TEXT,
        },
        balance: {
            type: Sequelize.INTEGER,


        },
        trade: {
            type: Sequelize.STRING,


        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'Активный',
            allowNull: false,

        },
        comment: {
            type: Sequelize.STRING,

        },
        status_monit: {
            type: Sequelize.STRING,
            defaultValue: 'Активный',
            allowNull: false,

        },
        comment_monit: {
            type: Sequelize.STRING,

        },
        starttoor: {
            type: Sequelize.STRING,

        },
        api: {
            type: Sequelize.STRING,

        },
        apikey: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        apisecret:{
            type: Sequelize.STRING,
            allowNull: false,
        },

    });

    return Accounts;
}