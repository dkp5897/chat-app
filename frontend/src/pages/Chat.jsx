import React, { useContext, useState } from "react";
import { chatContext } from "../context/chatContext";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const Chat = () => {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);

  const { user } = useContext(chatContext);
  if (!user) {
    navigate("/");
  }
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chat;
