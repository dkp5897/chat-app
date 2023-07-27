const jwt = require("jsonwebtoken");

const genrateToken = (id) => {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "5d",
  });
  return token;
};

module.exports = genrateToken;
