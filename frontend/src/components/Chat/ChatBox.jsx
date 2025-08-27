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
      p={0}
      bg="white"
      width={{ base: "100%", md: "calc(100% - 400px)" }}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="lg"
      overflow="hidden"
    >
      <SingleUserChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
