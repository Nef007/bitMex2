const jwt = require("jsonwebtoken");
const { reduce } = require("lodash");

module.exports = (user) => {
  return jwt.sign(
    {
      data: reduce(
        user,
        (result, value, key) => {
          if (key !== "password") {
            result[key] = value;
          }

          return result;
        },
        {}
      ),
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: '12h',
    }
  );
};
