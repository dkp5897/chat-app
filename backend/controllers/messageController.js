const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../middleware/ErrorHandler");
const messageSchema = require("../models/mesageModel");
const userSchema = require("../models/userModel");
const chatSchema = require("../models/chatModel");
const mesageModel = require("../models/mesageModel");


//@description     Crate a message
//@route           POST /api/message/
//@access          Protected

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    next(new ErrorHandler("Please provide all the fields", 401));
  }

  //   const newMassage = ;

  var message = await messageSchema.create({
    content: content,
    sender: req.user._id,
    chat: chatId,
  });

  // first way to populate

  message = await message.populate({
    path: "sender",
    select: "name email pic",
    model: "User",
  });

  message = await message.populate({
    path: "chat",
    model: "Chat",
    populate: {
      path: "users",
      model: "User",
    },
  });

  //updating the latestMessage in chat model by message
  await chatSchema.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message._id,
  });

  //second way to populate

  //now our response will include sender details also with name and pic
  // message = await message.populate("sender", "name , pic");

  // //now response will include chat details (the user details chating with or the group details) also
  // message = await message.populate({
  //   path: "chat",
  //   model: "Chat",
  //   // populate: {
  //   //   path: "latestMessage",
  //   //   model: "Messages",
  //   // },
  // });

  // //now response will include users details (name,pic,email), the message can see
  // message = await userSchema.populate(message, {
  //   path: "chat.users",
  //   select: "name pic email",
  // });

  res.send(message);
});

exports.getAllMessages = asyncHandler(async(req,res,next)=>{
    var messages = await messageSchema
      .find({ chat: req.params.chatId })
      .populate({
        path: "sender",
        select: "name email pic",
        model: "User",
      })
      .populate({
        path: "chat",
        model: "Chat",
        populate: {
          path: "users",
          model: "User",
        }
      });
      
      

    res.send(messages)
})
