const express = require('express')
const { sendMessage, getAllMessages } = require('../controllers/messageController')
const isAuthenticatedUser = require("../middleware/userAuthenticated")

const router = express.Router()

router.route("/new").post(isAuthenticatedUser, sendMessage);
router.route("/:chatId").get(isAuthenticatedUser, getAllMessages);


module.exports = router;