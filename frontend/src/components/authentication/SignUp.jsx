import React, { useState } from "react";
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
import { config } from "../../config/config";
import { validateForm } from "../../utils";


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");
    const {caludeURL} = config
    try {
      const response = await fetch({caludeURL}, {method: "POST", body: formData});
      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error("Image upload failed");
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPEG or PNG image",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }

      setProfilePic(file);
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setValidationErrors({});

      const picUrl = profilePic ? await uploadProfilePicture(profilePic) : "./profile.png";

      const { data } = await axios.post(`${config.baseURL}/api/user/signUp`, {
        ...formData,
        pic: picUrl
      }, {
        headers: { "Content-type": "application/json" }
      });

      // Success handling
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      navigate("/chat");

    } catch (error) {
      // Handle API errors
      toast({
        title: "Signup Error",
        description: error.response?.data.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl 
        id="name" 
        isRequired 
        isInvalid={!!validationErrors.name}
      >
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {validationErrors.name && (
          <FormControl color="red.500" fontSize="sm">
            {validationErrors.name}
          </FormControl>
        )}
      </FormControl>

      <FormControl 
        id="email" 
        isRequired 
        isInvalid={!!validationErrors.email}
      >
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {validationErrors.email && (
          <FormControl color="red.500" fontSize="sm">
            {validationErrors.email}
          </FormControl>
        )}
      </FormControl>

      <FormControl 
        id="password" 
        isRequired 
        isInvalid={!!validationErrors.password}
      >
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <InputRightElement width="4.5rem">
            <Button 
              h="1.75rem" 
              size="sm" 
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {validationErrors.password && (
          <FormControl color="red.500" fontSize="sm">
            {validationErrors.password}
          </FormControl>
        )}
      </FormControl>

      <FormControl 
        id="confirmPassword" 
        isRequired 
        isInvalid={!!validationErrors.confirmPassword}
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <InputRightElement width="4.5rem">
            <Button 
              h="1.75rem" 
              size="sm" 
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {validationErrors.confirmPassword && (
          <FormControl color="red.500" fontSize="sm">
            {validationErrors.confirmPassword}
          </FormControl>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Upload Profile Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/jpeg,image/png"
          onChange={handleProfilePicUpload}
        />
      </FormControl>

      <Button
        width="full"
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={isLoading}
        loadingText="Signing Up"
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;