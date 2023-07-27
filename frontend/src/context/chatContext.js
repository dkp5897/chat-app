
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const chatContext = createContext();

const StateProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chatsUsers, setChatsUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [notification,setNotification] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if(!userInfo){
      navigate("/")
    }
    
  },[navigate])

  

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        chatsUsers,
        setChatsUsers,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export default StateProvider;
