import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameUser } from "../../config/getSender";
import { chatContext } from "../../context/chatContext";
import { Avatar, Tooltip, Box, Text } from "@chakra-ui/react";

const MessagesBox = ({ messages }) => {
  const { user } = useContext(chatContext);
  
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => {
          const isMyMessage = message.sender._id === user.user._id;
          const showAvatar = isLastMessage(messages, index, user.user._id) || 
                           isSameSender(messages, message, index, user.user._id);
          
          return (
            <Box 
              key={message._id}
              display="flex" 
              flexDirection={isMyMessage ? "row-reverse" : "row"}
              alignItems="flex-end"
              mb={isSameUser(messages, message, index, user._id) ? 1 : 3}
              px={4}
            >
              {!isMyMessage && showAvatar && (
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={message.sender.name}
                    src={message.sender.pic}
                    border="2px solid white"
                    boxShadow="sm"
                  />
                </Tooltip>
              )}
              
              {!isMyMessage && !showAvatar && (
                <Box width="40px" />
              )}
              
              <Box
                bg={isMyMessage ? "blue.500" : "white"}
                color={isMyMessage ? "white" : "gray.800"}
                borderRadius={isMyMessage ? "18px 18px 4px 18px" : "18px 18px 18px 4px"}
                px={4}
                py={2.5}
                maxWidth="75%"
                boxShadow="sm"
                border={!isMyMessage ? "1px solid" : "none"}
                borderColor="gray.200"
                position="relative"
                _before={!isMyMessage ? {
                  content: '""',
                  position: "absolute",
                  bottom: "0",
                  left: "-6px",
                  width: "0",
                  height: "0",
                  borderStyle: "solid",
                  borderWidth: "0 8px 8px 0",
                  borderColor: "transparent white transparent transparent"
                } : undefined}
                _after={isMyMessage ? {
                  content: '""',
                  position: "absolute",
                  bottom: "0",
                  right: "-6px",
                  width: "0",
                  height: "0",
                  borderStyle: "solid",
                  borderWidth: "0 0 8px 8px",
                  borderColor: "transparent transparent blue.500 transparent"
                } : undefined}
              >
                <Text fontSize="sm" lineHeight="relaxed">
                  {message.content}
                </Text>
              </Box>
              
              {isMyMessage && showAvatar && (
                <Avatar
                  mt="7px"
                  ml={2}
                  size="sm"
                  name={message.sender.name}
                  src={message.sender.pic}
                  border="2px solid white"
                  boxShadow="sm"
                />
              )}
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default MessagesBox;
