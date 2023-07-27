import React, { useEffect, useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";

const SignUP = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pic, setPic] = useState("./profile.png");
  const [picLoading, setPicLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = input;

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", process.env.CLOUD_NAME);

      fetch("https://api.cloudinary.com/v1_1/dlufgryo6/image/upload", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          
          setPicLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Error Occur!",
            description:err,
            duration: 5000,
            status: "error",
            position: "bottom",
            isClosable: true,
          });
          setPicLoading(false);
        });
    }
  };

  const onSubmit = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Field all the fields",
        duration: 5000,
        status: "warning",
        position: "bottom",
        isClosable: true,
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Error Occur",
        duration:5000,
        description: "password and confirm password should be metch",
        status: "warning",
        position: "bottom",
        isClosable: true,
      });
      setPicLoading(false);
      return;
    }

    try {
      
       const config = {
         headers: {
           "Content-type": "application/json",
         },
       };

      const { data } = await axios.post(
        "https://chat-app-ziwf.onrender.com/api/user/signUp",
        {
          name,
          email,
          password,
          pic
        },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chat");
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      setPicLoading(false);
    }
  };

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("userInfo"))){
      
    }
  },[navigate])

  return (
    <VStack spacing={5}>
      <FormControl id="firstName" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          name="name"
          onChange={onChangeHandler}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          name="email"
          onChange={onChangeHandler}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size={"md"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            onChange={onChangeHandler}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size={"md"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            name="confirmPassword"
            onChange={onChangeHandler}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload Profile Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          isRequired
          onChange={(e) => postDetails(e.target.files[0])}
          name="pics"
        />
      </FormControl>
      <Button
        w={"50%"}
        marginTop={"2rem"}
        colorScheme={"blue"}
        onClick={onSubmit}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUP;
