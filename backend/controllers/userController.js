const genrateToken = require("../config/genrateToken");
const ErrorHandler = require("../middleware/ErrorHandler");
const userSchema = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.userRegister = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 401));
  }

  const userExist = await userSchema.findOne({ email });

  if (userExist) {
    return next(new ErrorHandler("this email is already registered", 401));
  }

  const user = await userSchema.create({
    name,
    email,
    password,
    pic,
  });

  //if user register successfully

  res.status(201).json({
    success: true,
    user,
    token: genrateToken(user._id),
  });
});

exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 401));
  }

  const user = await userSchema.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(" Invalid Email or Password ", 404));
  }

  const isAuthenticated = await user.comparePassword(password);

  if (!isAuthenticated) {
    return next(new ErrorHandler(" Invalid Email or Password ", 404));
  }

  res.status(201).json({
    success: true,
    user,
    token: genrateToken(user._id),
  });
});

//get All users

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // console.log(req.user._id);

  const user = await userSchema
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });

  res.status(201).json({
    success: true,
    user,
  });
});
