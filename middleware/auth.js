const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: "no token found, not authorized" }] });
  }

  //verifying token
  try {
    const verified = jwt.verify(token, config.get("jwtKey"));
    //console.log(verified);
    req.user = verified;
    req.admin = verified;
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: "Invalid token" }] });
  }
  next();
};
