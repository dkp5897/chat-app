import React from 'react'
import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import { chatContext } from "../../context/chatContext";
import SingleUserChat from "./SingleUserChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const { selectedChat } = useContext(chatContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleUserChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
