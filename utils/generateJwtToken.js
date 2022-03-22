const jwt = require("jsonwebtoken");
const config = require("config");
const generateToken = (id) => {
  return jwt.sign({ _id: id }, config.get("jwtKey"), {
    expiresIn: "30d",
  });
};
module.exports = generateToken;
