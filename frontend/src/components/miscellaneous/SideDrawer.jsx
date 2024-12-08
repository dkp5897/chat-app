import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { chatContext } from "../../context/chatContext";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserListBox from "../UserBoxes/UserListBox";
import ChatLoading from "./ChatLoadig";
import { getSender } from "../../config/getSender";
import NotificationBadge, { Effect } from 'react-notification-badge';
import {config} from '../../config/config'

const SideDrawer = () => {
  const {
    user,
    chatsUsers,
    setChatsUsers,
    setSelectedChat,
    notification,
    setNotification,
  } = useContext(chatContext);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const {baseURL} = config;

  //creating or accessing chatsUsers b/w login user and the user (UserId)
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json", // now we have to post data so we need content type
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${baseURL}/api/chats/userchat`,
        { userId },
        config
      );
      if (!chatsUsers.find((c) => c._id === data.chats._id))
        setChatsUsers([...chatsUsers, data.chats]);
      setSelectedChat(data.chats);
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const searchHandler = async () => {
    if (!search) {
      toast({
        status: "warning",
        description: "Please search somthing",
        position: "top-left",
        isClosable: true,
        duration: 4000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      let link = `${baseURL}/api/user?search=${search}`;

      const { data } = await axios.get(link, config);
      setLoading(false);
      setSearchResult(data.user);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <SearchIcon />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="3xl"
          textAlign={"center"}
          fontWeight={"bold"}
          textShadow={"2px 2px 4px "}
          color={"blue.400"}
          letterSpacing={3}
          fontFamily="Work sans"
        >
          Air Talk
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages yet"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(
                        user.user,
                        notif.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.user.name}
                src={user.user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user.user}>
                <MenuItem>MyProfile</MenuItem>
              </ProfileModel>
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult &&
              searchResult.map((user) => (
                <UserListBox
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
