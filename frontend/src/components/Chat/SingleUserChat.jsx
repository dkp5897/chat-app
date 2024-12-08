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
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user.user, selectedChat.users)}
                <ProfileModel
                  user={getSenderData(user.user, selectedChat.users)}
                />
              </>
            ) : (
              //getsender method return the name of user
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            padding={3}
            // bg="#E8E8E8"
            // objectFit={"cover"}
            backgroundSize={"cover"}
            bgGradient={{ base: bgImage1, md: bgImage5 }}
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY={"hidden"}
          // overflowY="hidden"
          >
            {loading ? (
              <>
                <Spinner
                  size="xl"
                  width={20}
                  height={20}
                  alignSelf="center"
                  margin="auto"
                />
              </>
            ) : (
              <div className="messages">
                <MessagesBox messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessages}>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  width={70}
                  height={35}
                  style={{ margin: 10 }}
                />
              )}
              <Box display={"flex"} marginTop={4}>
                <Input
                  variant={"filled"}
                  placeholder="Write your message here"
                  // bgColor={""}
                  onChange={onChangeHandler}
                  color={{ base: "blue", md: "white" }}
                  value={newMessages}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <IconButton
                  width={15}
                  height={10}
                  borderBottomRightRadius={10}
                  borderTopRightRadius={10}
                  onClick={sendByBtn}
                >
                  <Image
                    src={btn}
                    borderBottomRightRadius={10}
                    borderTopRightRadius={10}
                  />
                </IconButton>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          height={"100%"}
          alignItems={"center"}
        >
          <Text fontSize={"3xl"} fontFamily={"Work sans"} pb={3} color="green">
            Select an user to chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleUserChat;
