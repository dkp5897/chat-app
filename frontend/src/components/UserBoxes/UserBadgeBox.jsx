import { Badge } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { chatContext } from '../../context/chatContext';

const UserBadgeBox = ({user,handleFunction}) => {

  const { selectedChat } = useContext(chatContext);

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
        {user.name}
        
        <CloseIcon ml={2}/>
    </Badge>
  );
}

export default UserBadgeBox
