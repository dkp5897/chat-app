const asyncHandler = require("express-async-handler");
const chatSchema = require("../models/chatModel");
const ErrorHandler = require("../middleware/ErrorHandler");
const userSchema = require("../models/userModel");


//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
exports.userChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new ErrorHandler("Please provide userId", 401));
  }

  var chats = await chatSchema
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    //  populate() method is used to replace the user ObjectId field with the whole document consisting of all the user data. For this we only have to replace the query part
    .populate("users", "-password")
    .populate("latestMessage");

  chats = await userSchema.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chats.length > 0) {
    res.status(201).json({
      message: "already exist chat",
      chats:chats[0],
    });
    // res.send(chats[0]);
  } else {
    
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };
  }

  const createChat = await chatSchema.create(chatData);
  const fullChat = await chatSchema
    .findOne({ _id: createChat._id })
    .populate("users", "-password");

    res.status(201).json({
    message: "created new chats",
    chats:fullChat,
  });
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected

exports.getAllChats = asyncHandler(async (req, res, next) => {
  // console.log(req.user)
  var chats = await chatSchema
    .find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await userSchema.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  res.status(201).json({
    success: true,
    chats,
  });
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected

exports.groupChat = asyncHandler(async (req, res, next) => {
  let { name, users } = req.body;

  if (!name || !users) {
    return next(new ErrorHandler("Please provide all fields", 401));
  }

  users = JSON.parse(users); // we will provide a group of users in string form so converting in array of objecsts

  if (users.length < 2) {
    return next(new ErrorHandler("at least 2 users required to form a group"));
  }

  // login person is creating that group so he/she will also be a part of that group

  users.push(req.user);

  const isGroupChat = await chatSchema.create({
    chatName: name,
    users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await chatSchema
    .findOne({ _id: isGroupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json({
    success: true,
    fullGroupChat,
  });
});

//@description     Change the group name
//@route           POST /api/chat/rename
//@access          Protected

exports.groupRename = asyncHandler(async (req, res, next) => {
  const { groupId, groupName } = req.body;

  if (!groupId || !groupName) {
    return next(new ErrorHandler("Please provide all fields", 401));
  }

  const updatedChat = await chatSchema
    .findByIdAndUpdate(groupId, { chatName: groupName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return next(new ErrorHandler("group not found"));
  }

  res.status(201).json({
    success: true,
    updatedChat,
  });
});

//@description     Add new user in group
//@route           POST /api/chat/adduser
//@access          Protected

exports.addUserinGroup = asyncHandler(async (req, res, next) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return next(new ErrorHandler("Please provide all fields", 401));
  }

  const updatedGroup = await chatSchema
    .findByIdAndUpdate(groupId, { $push: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    return next(new ErrorHandler("group not found"));
  }

  res.status(201).json({
    success: true,
    updatedGroup,
  });
});

//@description     Remove a user from group
//@route           POST /api/chat/removeuser
//@access          Protected

exports.removeUserFromGroup = asyncHandler(async (req, res, next) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return next(new ErrorHandler("Please provide all fields", 401));
  }

  const updatedGroup = await chatSchema
    .findByIdAndUpdate(groupId, { $pull: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    return next(new ErrorHandler("group not found"));
  }

  res.status(201).json({
    success: true,
    updatedGroup,
  });
});
