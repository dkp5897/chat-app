import React, { useCallback, useContext, useEffect, useState } from "react";
import { chatContext } from "../../context/chatContext";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderData } from "../../config/getSender";
import ProfileModel from "../miscellaneous/ProfileModel";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import MessagesBox from "../messagesBox/MessagesBox";
import Lottie from 'react-lottie-player'
import io from 'socket.io-client'
import animationData from '../../animation/typing.json'
import btn from '../../Images/btn2.png'
import bgImage1 from '../../Images/bg1.png'
import bgImage5 from '../../Images/mdbg.png';
import {config} from '../../config/config';

const {baseURL} = config;



const ENDPOINT = `${baseURL}`;
var socket, selectedCompareChat;



const SingleUserChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(chatContext);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConneted] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false);


  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // const bgImages = [bgImage1, bgImage2, bgImage3, bgImage4];
  // const randomNumber = () => {
  //   return Math.floor(Math.random() * 4);
  // };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setSocketConneted(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  const onChangeHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing loaginc here
    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var TimeLength = 3000;

    setTimeout(() => {
      var time = new Date().getTime()
      var timeDiff = time - lastTypingTime
      if (timeDiff >= TimeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false)
      }
    }, TimeLength)
  };

  const sendingMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setNewMessage("");
      const { data } = await axios.post(
        `${baseURL}/api/message/new`,
        {
          content: newMessages,
          chatId: selectedChat._id,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        status: "error",
        description: error.response.data.message,
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
    }
  }

  const sendMessages = async (event) => {
    if (event.key === "Enter" && newMessages) {
      socket.emit("stop typing", selectedChat._id)
      sendingMessage()
    }
  };

  const sendByBtn = () => {
    socket.emit("stop typing", selectedChat._id);
    sendingMessage();
  }


  //fetching all messages
  const fetchMessages = useCallback(async () => {
    try {
      if (!selectedChat) return
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/api/message/${selectedChat._id}`, config);
      setMessages(data)
      setLoading(false)
      socket.emit("join-chat", selectedChat._id)
    } catch (error) {
      toast({
        status: "error",
        description: error.response.data.message,
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
    }
  }, [toast, user.token, selectedChat])



  useEffect(() => {
    fetchMessages();

    selectedCompareChat = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedCompareChat || selectedCompareChat._id !== newMessageRecieved.chat._id) {
        // show notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    });
  })

  return (
    <>
      {selectedChat ? (
        <>
          {/* Modern Chat Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            px={6}
            py={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
          >
            <Box display="flex" alignItems="center" gap={3}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                variant="ghost"
                size="sm"
                borderRadius="lg"
              />
              <Avatar
                size="md"
                name={!selectedChat.isGroupChat 
                  ? getSender(user.user, selectedChat.users) 
                  : selectedChat.chatName
                }
                src={!selectedChat.isGroupChat 
                  ? getSenderData(user.user, selectedChat.users)?.pic 
                  : undefined
                }
                bg="blue.400"
                color="white"
              />
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color="gray.800"
                  fontFamily="Inter"
                >
                  {!selectedChat.isGroupChat
                    ? getSender(user.user, selectedChat.users)
                    : selectedChat.chatName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {!selectedChat.isGroupChat ? "Online" : `${selectedChat.users.length} members`}
                </Text>
              </Box>
            </Box>
            
            <Box>
              {!selectedChat.isGroupChat ? (
                <ProfileModel
                  user={getSenderData(user.user, selectedChat.users)}
                />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </Box>
          </Box>
          
          {/* Messages Area */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            width="100%"
            height="calc(100% - 140px)"
            bg="gray.50"
            position="relative"
            overflow="hidden"
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Spinner
                  size="xl"
                  color="blue.500"
                  thickness="3px"
                />
              </Box>
            ) : (
              <Box className="messages" flex="1" overflowY="auto">
                <MessagesBox messages={messages} />
              </Box>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <Box px={4} py={2}>
                <Lottie
                  options={defaultOptions}
                  width={60}
                  height={30}
                  style={{ margin: 0 }}
                />
              </Box>
            )}
          </Box>
          
          {/* Modern Message Input */}
          <Box
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white"
          >
            <FormControl onKeyDown={sendMessages}>
              <Box display="flex" alignItems="center" gap={2}>
                <Input
                  placeholder="Type a message..."
                  onChange={onChangeHandler}
                  value={newMessages}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="full"
                  px={4}
                  py={3}
                  fontSize="sm"
                  bg="gray.50"
                  _focus={{
                    borderColor: "blue.500",
                    bg: "white",
                    boxShadow: "0 0 0 3px rgb(14 165 233 / 0.1)"
                  }}
                  _placeholder={{ color: "gray.500" }}
                />
                <IconButton
                  icon={
                    <Image
                      src={btn}
                      alt="Send"
                      width="20px"
                      height="20px"
                    />
                  }
                  onClick={sendByBtn}
                  bg="blue.500"
                  color="white"
                  borderRadius="full"
                  size="md"
                  _hover={{
                    bg: "blue.600",
                    transform: "scale(1.05)",
                  }}
                  _active={{
                    transform: "scale(0.95)",
                  }}
                  transition="all 0.2s"
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          flexDirection="column"
          gap={4}
          bg="gray.50"
        >
          <Box
            p={8}
            borderRadius="2xl"
            bg="white"
            boxShadow="lg"
            textAlign="center"
          >
            <Text
              fontSize="2xl"
              fontWeight="600"
              color="gray.600"
              mb={2}
              fontFamily="Inter"
            >
              Welcome to AirTalk
            </Text>
            <Text fontSize="md" color="gray.500">
              Select a chat to start messaging
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SingleUserChat;
