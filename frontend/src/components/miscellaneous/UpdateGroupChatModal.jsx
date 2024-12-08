import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { chatContext } from "../../context/chatContext";
import UserBadgeBox from "../UserBoxes/UserBadgeBox";
import axios from "axios";
import UserListBox from "../UserBoxes/UserListBox";
import {config} from '../../config/config';


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const {baseURL} = config;
  const [groupName, setGroupName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = useContext(chatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onSearchUserHandler = async (query) => {
    setSearchUser(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      let link = `${baseURL}/api/user?search=${searchUser}`;

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

  const updateGroupName = async () => {
    if (!groupName) {
      toast({
        title: "Warning!",
        description: "Please fill new name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/api/chats/rename`,
        {
          groupId: selectedChat._id,
          groupName: groupName,
        },
        config
      );

      setSelectedChat(data.fullGroupChat);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: error,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const removeUser = async (user1) => {
    if (selectedChat.groupAdmin._id !== user.user._id && user1._id !== user.user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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

      const { data } = await axios.put(
        `${baseURL}/api/chats/removeuser`,
        {
          groupId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      // console.log(data)
      user1._id === user.user._id
        ? setSelectedChat()
        : setSelectedChat(data.updatedGroup);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const addNewUser = async (newUser) => {
    if (selectedChat.users.find((u) => u._id === newUser._id)) {
      toast({
        title: "Warning!",
        description: "The user is already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    //If the logged user is not group admin then return
    if (selectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "Warning!",
        description: "Only admin can add a person",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
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

      const { data } = await axios.put(
        `${baseURL}/api/chats/adduser`,
        {
          groupId: selectedChat._id,
          userId: newUser._id,
        },
        config
      );
      // console.log(data)
      setSelectedChat(data.updatedGroup);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"} mt={1}>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"}>
              {selectedChat.users.map((user) => (
                <UserBadgeBox
                  key={user._id}
                  user={user}
                  handleFunction={() => removeUser(user)}
                />
              ))}
            </Box>
            <FormControl margin={2} display={"flex"}>
              <Input
                placeholder="New Group Name ?"
                marginBottom={1}
                value={groupName}
                mr={2}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button onClick={updateGroupName} colorScheme="blue">
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add group members"
                marginBottom={1}
                onChange={(e) => onSearchUserHandler(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListBox
                    key={user._id}
                    user={user}
                    handleFunction={() => addNewUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"center"}>
            <Button colorScheme="red" onClick={() => removeUser(user.user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
