const express = require("express");
const {
  userRegister,
  userLogin,
  getAllUsers,
} = require("../controllers/userController");
const isAuthenticatedUser = require("../middleware/userAuthenticated");

const router = express.Router();

router.route("/signUp").post(userRegister);
router.route("/login").post(userLogin);
router.route("/").get(isAuthenticatedUser, getAllUsers);

module.exports = router;
