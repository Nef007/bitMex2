const moment = require("moment");
const {QueryTypes} = require('sequelize');
const db = require("../configNodemailer");
const dbSeq = require("../db/models/");

module.exports = async (req, res, next) => {
  const id = req.user.id;

  await dbSeq.sequelize.query(`UPDATE users SET last_seen=? where id=?`,
      {
        replacements: [Date.now(), id],
        type: QueryTypes.UPDATE,
      }
  );

  next();
};
