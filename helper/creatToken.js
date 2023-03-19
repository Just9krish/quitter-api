const jwt = require("jsonwebtoken");

function getToken(user) {
  return jwt.sign(user, process.env.SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
}

module.exports = getToken;
