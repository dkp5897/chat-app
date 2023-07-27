const express = require("express");
const {
  userChat,
  getAllChats,
  groupChat,
  groupRename,
  addUserinGroup,
  removeUserFromGroup,
} = require("../controllers/chatController");
const isAuthenticatedUser = require("../middleware/userAuthenticated");

const router = express.Router();

router
  .route("/userChat")
  .post(isAuthenticatedUser, userChat)
  .get(isAuthenticatedUser, getAllChats);

router.route("/groupChat").post(isAuthenticatedUser, groupChat);
router.route("/rename").put(isAuthenticatedUser, groupRename);
router.route("/adduser").put(isAuthenticatedUser, addUserinGroup);
router.route("/removeuser").put(isAuthenticatedUser, removeUserFromGroup);

module.exports = router;
