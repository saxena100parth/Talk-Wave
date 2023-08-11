const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "parth", {
    expiresIn: "90d",
  });
};

module.exports = generateToken;
