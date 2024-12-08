import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {config} from '../../config/config';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const {baseURL} = config;

  const onSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Useless try",
        description: "Please fill all the fields",
        duration: 5000,
        status: "warning",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${baseURL}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      // setError(Promise.reject(error.response.data.message));
      console.log(error.response.data)
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size={"md"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Box display={"flex"} justifyContent={"space-evenly"} width={"100%"}>
        <Button
          w={"100%"}
          margin={"2rem"}
          colorScheme={"blue"}
          isLoading={loading}
          onClick={onSubmit}
        >
          Login
        </Button>
        <Button
          w={"100%"}
          margin={"2rem"}
          colorScheme={"green"}
          onClick={() => {
            setEmail("guest@gmail.com");
            setPassword("123456");
          }}
        >
          Guest User
        </Button>
      </Box>
    </VStack>
  );
};

export default Login;
