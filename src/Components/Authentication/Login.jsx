import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chatState } from "../../context/chatProvider";

function Login() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = chatState();
  const loginUser = async ({ email, password }) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Logged in Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
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
      setLoading(false);
    }
  };

  const guestLogin = () => {
    const email = `${import.meta.env.VITE_GUEST_EMAIL}`;
    const password = `${import.meta.env.VITE_GUEST_PASSWORD}`;

    loginUser({ email, password });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const obj = {
      email: formData.get("email") ?? "",
      password: formData.get("password") ?? "",
    };

    if (!obj.email || !obj.password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // login user
    loginUser(obj);
  };

  return (
    <form
      style={{ display: "flex", flexFlow: "column", gap: "1rem" }}
      onSubmit={handleFormSubmit}
    >
      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Email</FormLabel>
        <Input placeholder="Enter your email" id="login-email" name="email" />
      </FormControl>

      <FormControl variant="floating" isRequired>
        <FormLabel fontWeight={"semibold"}>Password</FormLabel>

        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            id="login-password"
            name="password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        variant="solid"
        width="100%"
        type="submit"
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme="pink"
        variant="solid"
        width="100%"
        onClick={guestLogin}
        isLoading={loading}
      >
        Guest Login
      </Button>
    </form>
  );
}

export default Login;
