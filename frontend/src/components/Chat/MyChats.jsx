import React, { useCallback, useContext, useEffect, useState } from "react";
import { chatContext } from "../../context/chatContext";
import { Box, Button, Stack, Text, useToast, Avatar } from "@chakra-ui/react";
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
      p={0}
      bg="white"
      width={{ base: "100%", md: "380px" }}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="lg"
      overflow="hidden"
    >
      <Box
        pb={3}
        pt={4}
        px={4}
        fontSize={{ base: "lg", md: "xl" }}
        fontFamily="Inter"
        fontWeight="600"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="gray.50"
      >
        <Text color="gray.700">Messages</Text>
        <GroupChatModel>
          <Button
            size="sm"
            fontSize="sm"
            rightIcon={<AddIcon />}
            bg="blue.500"
            color="white"
            borderRadius="lg"
            _hover={{ 
              bg: "blue.600",
              transform: "translateY(-1px)",
              boxShadow: "md"
            }}
            transition="all 0.2s"
            fontWeight="500"
          >
            New Group
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        width="100%"
        height="100%"
        overflowY="hidden"
        flex="1"
      >
        {chatsUsers ? (
          <Stack spacing={0} overflowY="scroll" p={2}>
            {chatsUsers &&
              chatsUsers.map((chat) => (
                <Box
                  width="100%"
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "blue.50" : "transparent"}
                  color={selectedChat === chat ? "blue.700" : "gray.700"}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  key={chat._id}
                  border={selectedChat === chat ? "1px solid" : "1px solid transparent"}
                  borderColor={selectedChat === chat ? "blue.200" : "transparent"}
                  _hover={{
                    bg: selectedChat === chat ? "blue.100" : "gray.50",
                    transform: "translateX(2px)",
                  }}
                  transition="all 0.2s"
                  mb={1}
                  position="relative"
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      size="md"
                      name={!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                      src={!chat.isGroupChat ? chat.users.find(u => u._id !== loggedUser._id)?.pic : undefined}
                      bg="blue.400"
                      color="white"
                    />
                    <Box flex="1" minWidth="0">
                      <Text 
                        fontWeight="600" 
                        fontSize="sm"
                        isTruncated
                        mb={1}
                      >
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text 
                          fontSize="xs" 
                          color="gray.500"
                          isTruncated
                        >
                          {chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                    {selectedChat === chat && (
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        bottom="0"
                        width="3px"
                        bg="blue.500"
                        borderRadius="full"
                      />
                    )}
                  </Box>
                </Box>
              ))}
          </Stack>
        ) : (
          <Box p={4}>
            <ChatLoading />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
