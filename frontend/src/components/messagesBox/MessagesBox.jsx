import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { backGroundColor, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/getSender";
import { chatContext } from "../../context/chatContext";
import { Avatar, Tooltip } from "@chakra-ui/react";
const MessagesBox = ({ messages }) => {
  const { user } = useContext(chatContext);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isLastMessage(messages, index, user.user._id) ||
              isSameSender(messages, message, index, user.user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: backGroundColor(message,user),
                marginLeft: isSameSenderMargin(messages, message, index, user.user._id),
                marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default MessagesBox;
