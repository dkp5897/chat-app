import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { chatContext } from "../../context/chatContext";
import axios from "axios";
import UserListBox from "../UserBoxes/UserListBox";
import UserBadgeBox from "../UserBoxes/UserBadgeBox";
import {config} from "../../config/config";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chatsUsers, setChatsUsers } = useContext(chatContext);
  const toast = useToast();
  const {baseURL} = config;

  //searching users for group addition

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

  const selectUserForGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "Already Added",
        description: "This user is already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const deeleUser = (deletedUser)=> {
    setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== deletedUser._id))
  }

  const submitHadler = async() => {
    if(!groupName || !selectedUsers){
      toast({
        title: "Warning!",
        description: "Please Fill All the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return 
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${baseURL}/api/chats/groupChat`,{
          name:groupName,
          users:JSON.stringify(selectedUsers.map(user=>user._id))
        },config
      );
      setChatsUsers([...chatsUsers, data.fullGroupChat]);
      onClose()
      toast({
        title: "New Group is Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl margin={2}>
              <Input
                placeholder="Group Name"
                marginBottom={1}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add group members"
                marginBottom={1}
                onChange={(e) => onSearchUserHandler(e.target.value)}
              />
            </FormControl>

            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((user) => (
                <UserBadgeBox
                  key={user._id}
                  handleFunction={() => deeleUser(user)}
                  user={user}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListBox
                    key={user._id}
                    user={user}
                    handleFunction={() => selectUserForGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter display={"flex"} justifyContent={"center"}>
            <Button colorScheme="green" onClick={submitHadler}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
