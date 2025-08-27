import React from 'react';
import {
  Box,
  Text,
  Avatar,
  IconButton,
  Input,
  Image,
  Stack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Demo component to showcase the modern chat UI
const ModernChatDemo = () => {
  const demoMessages = [
    { id: 1, sender: 'John Doe', content: 'Hey there! How are you doing?', isMe: false, time: '10:30 AM' },
    { id: 2, sender: 'Me', content: 'Hi John! I\'m doing great, thanks for asking!', isMe: true, time: '10:32 AM' },
    { id: 3, sender: 'John Doe', content: 'That\'s awesome! Are you free this weekend?', isMe: false, time: '10:33 AM' },
    { id: 4, sender: 'Me', content: 'Yes, I should be free. What did you have in mind?', isMe: true, time: '10:35 AM' },
    { id: 5, sender: 'John Doe', content: 'Maybe we could grab some coffee and catch up?', isMe: false, time: '10:36 AM' },
  ];

  const demoChats = [
    { id: 1, name: 'John Doe', lastMessage: 'Maybe we could grab some coffee...', time: '10:36 AM', avatar: '👨', online: true },
    { id: 2, name: 'Sarah Wilson', lastMessage: 'See you tomorrow!', time: 'Yesterday', avatar: '👩', online: false },
    { id: 3, name: 'Team Chat', lastMessage: 'Mike: Great work everyone!', time: '2 days ago', avatar: '👥', online: true },
    { id: 4, name: 'Alice Brown', lastMessage: 'Thanks for the help!', time: '3 days ago', avatar: '👩‍💼', online: false },
  ];

  return (
    <Box
      minHeight="100vh"
      bg="linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)"
      p={4}
    >
      {/* Modern Header */}
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
        borderRadius="xl"
        mb={4}
      >
        <Button 
          variant="ghost" 
          borderRadius="lg"
          _hover={{ 
            bg: "gray.100",
            transform: "translateY(-1px)",
            boxShadow: "md"
          }}
        >
          <SearchIcon color="gray.600" />
          <Text px={4} color="gray.700" fontWeight="500">
            Search User
          </Text>
        </Button>
        
        <Text
          fontSize="3xl"
          fontWeight="700"
          bgGradient="linear(to-r, blue.400, blue.600)"
          bgClip="text"
          letterSpacing="tight"
          fontFamily="Inter"
        >
          AirTalk
        </Text>
        
        <Flex alignItems="center" gap={3}>
          <IconButton
            icon={<BellIcon />}
            variant="ghost"
            borderRadius="lg"
            color="gray.600"
          />
          <IconButton
            icon={<Avatar size="sm" name="Demo User" bg="blue.500" />}
            variant="ghost"
            borderRadius="lg"
          />
        </Flex>
      </Box>

      {/* Main Chat Layout */}
      <Box
        display="flex"
        gap={4}
        height="calc(100vh - 140px)"
        maxWidth="1400px"
        margin="0 auto"
      >
        {/* Chat List Sidebar */}
        <Box
          width="380px"
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="lg"
          overflow="hidden"
        >
          {/* Chat List Header */}
          <Box
            p={4}
            borderBottom="1px solid"
            borderColor="gray.100"
            bg="gray.50"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="xl" fontWeight="600" color="gray.700" fontFamily="Inter">
              Messages
            </Text>
            <Button
              size="sm"
              rightIcon={<AddIcon />}
              bg="blue.500"
              color="white"
              borderRadius="lg"
              _hover={{ bg: "blue.600" }}
            >
              New Group
            </Button>
          </Box>

          {/* Chat List */}
          <Stack spacing={0} p={2}>
            {demoChats.map((chat, index) => (
              <Box
                key={chat.id}
                p={4}
                borderRadius="lg"
                cursor="pointer"
                bg={index === 0 ? "blue.50" : "transparent"}
                border={index === 0 ? "1px solid" : "1px solid transparent"}
                borderColor={index === 0 ? "blue.200" : "transparent"}
                _hover={{ bg: index === 0 ? "blue.100" : "gray.50" }}
                mb={1}
                position="relative"
              >
                <Flex alignItems="center" gap={3}>
                  <Box position="relative">
                    <Avatar
                      size="md"
                      name={chat.name}
                      bg="blue.400"
                      color="white"
                    />
                    {chat.online && (
                      <Box
                        position="absolute"
                        bottom="0"
                        right="0"
                        width="12px"
                        height="12px"
                        bg="green.400"
                        border="2px solid white"
                        borderRadius="full"
                      />
                    )}
                  </Box>
                  <Box flex="1" minWidth="0">
                    <Flex justifyContent="space-between" alignItems="center" mb={1}>
                      <Text fontWeight="600" fontSize="sm" isTruncated>
                        {chat.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {chat.time}
                      </Text>
                    </Flex>
                    <Text fontSize="xs" color="gray.500" isTruncated>
                      {chat.lastMessage}
                    </Text>
                  </Box>
                </Flex>
                {index === 0 && (
                  <Box
                    position="absolute"
                    right="0"
                    top="0"
                    bottom="0"
                    width="3px"
                    bg="blue.500"
                    borderRadius="full"
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Chat Interface */}
        <Box
          flex="1"
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="lg"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Chat Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={6}
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
          >
            <Flex alignItems="center" gap={3}>
              <Avatar
                size="md"
                name="John Doe"
                bg="blue.400"
                color="white"
              />
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.800" fontFamily="Inter">
                  John Doe
                </Text>
                <Text fontSize="sm" color="green.500" fontWeight="500">
                  Online
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Messages Area */}
          <Box
            flex="1"
            bg="gray.50"
            p={6}
            overflowY="auto"
          >
            <Stack spacing={4}>
              {demoMessages.map((message) => (
                <Flex
                  key={message.id}
                  flexDirection={message.isMe ? "row-reverse" : "row"}
                  alignItems="flex-end"
                >
                  {!message.isMe && (
                    <Avatar
                      size="sm"
                      name={message.sender}
                      bg="blue.400"
                      color="white"
                      mr={2}
                    />
                  )}
                  
                  <Box
                    bg={message.isMe ? "blue.500" : "white"}
                    color={message.isMe ? "white" : "gray.800"}
                    borderRadius={message.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px"}
                    px={4}
                    py={2.5}
                    maxWidth="75%"
                    boxShadow="sm"
                    border={!message.isMe ? "1px solid" : "none"}
                    borderColor="gray.200"
                    position="relative"
                  >
                    <Text fontSize="sm" lineHeight="relaxed">
                      {message.content}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={message.isMe ? "blue.100" : "gray.500"}
                      mt={1}
                    >
                      {message.time}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </Box>

          {/* Message Input */}
          <Box
            p={6}
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white"
          >
            <Flex alignItems="center" gap={2}>
              <Input
                placeholder="Type a message..."
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
                flex="1"
              />
              <IconButton
                icon={<Text fontSize="lg">📤</Text>}
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
              />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ModernChatDemo;