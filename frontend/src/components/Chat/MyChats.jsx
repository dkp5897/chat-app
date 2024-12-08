import React, { useCallback, useContext, useEffect, useState } from "react";
import { chatContext } from "../../context/chatContext";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import GroupChatModel from "../miscellaneous/GroupChatModel";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import ChatLoading from "../miscellaneous/ChatLoadig";
import { getSender } from "../../config/getSender";
import {config} from "../../config/config";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chatsUsers, setChatsUsers } =
    useContext(chatContext);
  const [loggedUser, setLoggedUser] = useState(user.user);
  const toast = useToast();
  const {baseURL} = config;
  
  const fetchChats = useCallback(async ()=>{
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `${baseURL}/api/chats/userchat`,
          config
        );
        setChatsUsers(data.chats); // storing every users in chats who started chating with logged user
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  },[setChatsUsers,toast,user.token, baseURL])

  useEffect(() => {
    setLoggedUser(user.user);
    fetchChats();
  }, [fetchChats,fetchAgain, user.user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        // flexDir={"column"}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        padding={3}
        backgroundColor="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatsUsers ? (
          <Stack overflowY={"scroll"}>
            {chatsUsers &&
              chatsUsers.map((chat) => (
                <Box
                  width={"100%"}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  backgroundColor={
                    selectedChat === chat ? "#6495ED" : "#E8E8E8"
                  }
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text width={"100%"}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
