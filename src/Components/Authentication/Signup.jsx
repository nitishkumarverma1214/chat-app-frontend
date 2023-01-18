import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { chatState } from "../../context/chatProvider";

function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClick = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const [picLoading, setPicLoading] = useState(false);
  const [picUrl, setPicUrl] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const { setUser } = chatState();

  const uploadImage = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      if (
        pics.type === "image/jpeg" ||
        pics.type === "image/jpg" ||
        pics.type === "image/png"
      ) {
        const formData = new FormData();
        formData.append("file", pics);
        formData.append("upload_preset", "chat-app");

        const respose = await axios.post(
          `${import.meta.env.VITE_CLOUDINARY_URL}`,
          formData
        );
        console.log(respose.data);
        const url = respose.data.secure_url ?? "";
        setPicUrl(url);
        console.log(picUrl);
        setPicLoading(false);
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const obj = {
      name: formData.get("name") ?? "",
      email: formData.get("email") ?? "",
      password: formData.get("password") ?? "",
      confirmPassword: formData.get("confirmPassword") ?? "",
      pic: picUrl,
    };

    if (!obj.name || !obj.email || !obj.password || !obj.confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (obj.password !== obj.confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    console.log(obj);

    // create the new user here
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user`,
        obj,
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      setUser(data);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <form
      style={{ display: "flex", flexFlow: "column", gap: "1rem" }}
      onSubmit={handleFormSubmit}
    >
      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Name</FormLabel>
        <Input placeholder="Enter your name" id="name" name="name" />
      </FormControl>
      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Email</FormLabel>
        <Input placeholder="Enter your email" id="email" name="email" />
      </FormControl>

      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Password</FormLabel>

        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            id="password"
            name="password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Confirm Password</FormLabel>

        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter password"
            id="confirmPassword"
            name="confirmPassword"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight={"semibold"}>Profile Pic</FormLabel>
        <Input
          placeholder="Select your profile pic"
          type={"file"}
          accept="image/*"
          id="pic"
          name="pic"
          onChange={(e) => uploadImage(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        variant="solid"
        width="100%"
        type="submit"
        isLoading={picLoading}
      >
        Sign up
      </Button>
    </form>
  );
}
export default Signup;
