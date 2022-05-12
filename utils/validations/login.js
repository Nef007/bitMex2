const { check } = require("express-validator");

module.exports = [
  //check("email").isEmail(),
  check("password").isLength({ min: 5 }),
];
