const verifyJWTToken = require("../utils/verifyJWTToken");

module.exports = (req, res, next) => {
  if (
    req.path === "/user/login" ||
    req.path === "/user/register"
  ) {
    return next();
  }

  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    let token;


    token = req.headers.authorization.split(" ")[1]; // bearer TOKEN


    if (!token) {
      return res.status(402).json({ message: "Нет авторизации" });
    }
    verifyJWTToken(token)
      .then((user) => {

        req.user = user.data;
        next();
      })
      .catch(() => {
        res.status(403).json({ message: "Не действительный токен" });
      });
  } catch (e) {
    res.status(401).json({ message: "Нет авторизации111" });
  }
};
