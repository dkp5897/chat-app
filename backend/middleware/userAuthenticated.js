const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/userModel");
const ErrorHandler = require("./ErrorHandler");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, "jhdfghdjvdvgdcdcd");

      req.user = await userSchema.findById(decode.id).select("-password");

      next();
    } catch (error) {
      next(new ErrorHandler("authentication failed"));
    }
  }

  if (!token) {
    next(new ErrorHandler("Please login before access this"));
  }
});

module.exports = isAuthenticatedUser;
