const { check } = require("express-validator");

module.exports = [
  check("email").isLowercase().trim().matches(
    /^(?=.*[a-z])[a-z@$.!%*#?&]/).withMessage( 'Использование загланых букв некорректно' ),

];
