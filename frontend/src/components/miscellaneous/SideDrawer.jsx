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
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(10px)"
        w="100%"
        p="1rem 1.5rem"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button 
            variant="ghost" 
            onClick={onOpen}
            borderRadius="lg"
            _hover={{ 
              bg: "gray.100",
              transform: "translateY(-1px)",
              boxShadow: "md"
            }}
            transition="all 0.2s"
          >
            <SearchIcon color="gray.600" />
            <Text d={{ base: "none", md: "flex" }} px={4} color="gray.700" fontWeight="500">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          textAlign="center"
          fontWeight="700"
          bgGradient="linear(to-r, blue.400, blue.600)"
          bgClip="text"
          letterSpacing="tight"
          fontFamily="Inter"
        >
          AirTalk
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Menu>
            <MenuButton p={1}>
              <Box position="relative">
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon 
                  fontSize="xl" 
                  color="gray.600"
                  _hover={{ color: "blue.500" }}
                  transition="color 0.2s"
                />
              </Box>
            </MenuButton>
            <MenuList 
              pl={2} 
              borderRadius="lg" 
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.200"
            >
              {!notification.length && (
                <Text p={3} color="gray.500" fontSize="sm">No new messages yet</Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  borderRadius="md"
                  _hover={{ bg: "blue.50" }}
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
            <MenuButton 
              as={Button} 
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              borderRadius="lg"
              _hover={{ 
                bg: "gray.100",
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.user.name}
                src={user.user.pic}
                border="2px solid"
                borderColor="blue.200"
              />
            </MenuButton>
            <MenuList
              borderRadius="lg"
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <ProfileModel user={user.user}>
                <MenuItem borderRadius="md" _hover={{ bg: "blue.50" }}>
                  My Profile
                </MenuItem>
              </ProfileModel>
              <MenuItem 
                onClick={logoutHandler}
                borderRadius="md" 
                _hover={{ bg: "red.50", color: "red.600" }}
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent borderRadius="0 lg lg 0">
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor="gray.200"
            fontWeight="600"
            color="gray.700"
          >
            Search User
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 3px rgb(14 165 233 / 0.1)"
                }}
              />
              <Button 
                onClick={searchHandler}
                bg="blue.500"
                color="white"
                borderRadius="lg"
                _hover={{ bg: "blue.600" }}
                px={6}
              >
                Go
              </Button>
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
            {loadingChat && <Spinner ml="auto" d="flex" color="blue.500" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
