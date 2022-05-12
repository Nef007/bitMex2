const { check } = require("express-validator");

module.exports = [
  check("new_password").isLength({ min: 5 }).matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$.!%*#?&])[a-zA-Z\d@$.!%*#?&]/,
  ),

];
