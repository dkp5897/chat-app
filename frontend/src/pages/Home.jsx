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
import homeGif from "../Images/live chat.gif";

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
      display={"flex"}
      alignItems={"center"}
      // justifyContent={"space-around"}
    >
      <Box
        display={{ base: "none", md: "block" }}
        bgGradient={homeGif}
        width={"50%"}
        height={"40vh"}
        marginLeft={25}
      ></Box>

      <Container maxW={"2xl"} centerContent>
        <Box
          display={"flex"}
          justifyContent={"center"}
          width={"100%"}
          borderBottom={"none"}
          borderTopLeftRadius={"60px"}
          borderTopRightRadius={"60px"}
          borderWidth={"medium"}
          fontSize={"xx-large"}
          marginTop={"25%"}
        >
          <Text
            textAlign={"center"}
            fontSize={50}
            fontWeight={"bold"}
            textShadow={"2px 2px 4px "}
            color={"blue.400"}
            letterSpacing={3}
            textDecor={"underline"}
          >
            AirTalk
          </Text>
        </Box>

        <Box
          w={"100%"}
          bgColor={"rgb(253,253,253)"}
          p={4}
          borderBottomRightRadius={"60px"}
          borderBottomLeftRadius={"60px"}
          borderWidth={"medium"}
          borderTop={"none"}
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={"2rem"}>
              <Tab w={"50%"}>Login</Tab>
              <Tab w={"50%"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
