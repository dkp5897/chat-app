import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setData(userInfo);
  }, []);

  if (data) {
    navigate("/chat");
  }
  // console.log(data);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
      p={4}
    >
      <Container maxW="lg" centerContent>
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="2xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          width="100%"
          className="fade-in"
        >
          {/* Header */}
          <Box
            bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            py={8}
            px={6}
            textAlign="center"
          >
            <Text
              fontSize="4xl"
              fontWeight="800"
              color="white"
              letterSpacing="tight"
              fontFamily="Inter"
              mb={2}
            >
              AirTalk
            </Text>
            <Text
              color="blue.100"
              fontSize="lg"
              fontWeight="400"
            >
              Connect with friends instantly
            </Text>
          </Box>

          {/* Form Section */}
          <Box p={8}>
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList mb={6} bg="gray.100" borderRadius="xl" p={1}>
                <Tab 
                  w="50%" 
                  borderRadius="lg"
                  fontWeight="600"
                  _selected={{
                    bg: "blue.500",
                    color: "white",
                    boxShadow: "md"
                  }}
                >
                  Login
                </Tab>
                <Tab 
                  w="50%" 
                  borderRadius="lg"
                  fontWeight="600"
                  _selected={{
                    bg: "blue.500",
                    color: "white",
                    boxShadow: "md"
                  }}
                >
                  Sign Up
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Login />
                </TabPanel>
                <TabPanel p={0}>
                  <SignUp />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
