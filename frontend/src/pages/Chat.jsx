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
    <div style={{ 
      width: "100%", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)"
    }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="calc(100vh - 80px)"
        padding="1rem"
        gap="1rem"
        maxWidth="1400px"
        margin="0 auto"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chat;
