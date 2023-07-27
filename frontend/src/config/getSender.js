exports.getSender = (loggedUser, users) => {
  return (users[1]._id === loggedUser._id ? users[0].name : users[1].name);
};


exports.getSenderData = (loggedUser, users) => {
  return (users[1]._id === loggedUser._id ? users[0] : users[1]);
};



exports.isSameSender = (messages,message,i, userId) =>{
  return(
    i < messages.length-1 && 
    (
      messages[i+1].sender._id !== message.sender._id ||
      messages[i+1].sender._id === undefined
    ) && messages[i].sender._id !== userId
  )
}

exports.isLastMessage = (messages,i,userId) =>{
  return(
    i === messages.length - 1 && 
    messages[messages.length-1].sender._id !== userId &&
    messages[messages.length-1].sender._id
  )
}

exports.isSameSenderMargin = (messages, m, i, userId) => {

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

exports.isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

exports.backGroundColor = (message,user) =>{
  if(message.sender._id !== user.user._id){
    return "#B9F5D0";
  }
  return "#BEE3F8";
}